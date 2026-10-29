const { test } = require('node:test');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const assert=require('node:assert/strict');const fs=require('fs');const vm=require('vm');
const apiModule = { exports: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'api/nexo-plans.js'), 'utf8'), { module: apiModule, process, require: () => ({ clientId: null, monthlyPlanId: null, annualPlanId: null }) });
const handler = apiModule.exports;
const res=()=>({headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(data){this.data=data;return this}});
test('public plan configuration validates IDs and never returns a secret', () => {
const original={...process.env};
delete process.env.PAYPAL_NEXO_MONTHLY_PLAN_ID;delete process.env.PAYPAL_NEXO_ANNUAL_PLAN_ID;
let response=res();handler({method:'GET'},response);assert.equal(response.data.plans.monthly.planId,null);assert.equal(response.data.plans.annual.amount,'1100.00');assert.equal(response.data.plans.annual.interval,'YEAR');
process.env.PAYPAL_NEXO_MONTHLY_PLAN_ID='P-MONTHLY123456789';process.env.PAYPAL_NEXO_ANNUAL_PLAN_ID='P-ANNUAL1234567890';process.env.PAYPAL_API_CLIENT_SECRET='mock-secret-must-not-be-returned';
response=res();handler({method:'GET'},response);assert.equal(response.data.plans.monthly.planId,process.env.PAYPAL_NEXO_MONTHLY_PLAN_ID);assert.ok(!JSON.stringify(response.data).includes('mock-secret'));assert.equal(response.headers['Cache-Control'],'no-store');
response=res();handler({method:'POST'},response);assert.equal(response.code,405);assert.equal(response.headers.Allow,'GET');
process.env.PAYPAL_NEXO_MONTHLY_PLAN_ID='invalid';response=res();handler({method:'GET'},response);assert.equal(response.data.plans.monthly.planId,null);
for(const name of ['PAYPAL_NEXO_MONTHLY_PLAN_ID','PAYPAL_NEXO_ANNUAL_PLAN_ID','PAYPAL_API_CLIENT_SECRET']){if(original[name]===undefined)delete process.env[name];else process.env[name]=original[name]}
});
const source=fs.readFileSync(path.join(root, 'scripts/create-nexo-paypal-plans.cjs'),'utf8');
async function scenario(existing,badAmount=false){
 const logs=[],errors=[],requests=[];let product=existing?{id:'CASALABS-NEXO-V1',name:'Nexo',type:'SERVICE'}:null;const plans=new Map();
 const make=(name,unit,amount,id)=>({id,name,product_id:'CASALABS-NEXO-V1',status:'ACTIVE',billing_cycles:[{frequency:{interval_unit:unit,interval_count:1},tenure_type:'REGULAR',total_cycles:0,pricing_scheme:{fixed_price:{value:amount,currency_code:'USD'}}}]});
 if(existing){plans.set('P-MONTHLY123456789',make('Nexo mensual','MONTH','100.00','P-MONTHLY123456789'));plans.set('P-ANNUAL1234567890',make('Nexo anual - un mes gratis','YEAR','1100.00','P-ANNUAL1234567890'));}
 const processMock={argv:['node','script'],env:{PAYPAL_API_CLIENT_ID:'mock-client',PAYPAL_API_CLIENT_SECRET:'mock-secret'},exitCode:0};
 const fetch=async(url,options={})=>{const path=new URL(url).pathname;const method=options.method||'GET';requests.push({path,method});let value,status=200;
  if(path.endsWith('/oauth2/token'))value={access_token:'mock-access-token'};
  else if(path.includes('/catalogs/products/')){value=product;status=product?200:404;}
  else if(path==='/v1/catalogs/products'){product=JSON.parse(options.body);value=product;status=201;}
  else if(path==='/v1/billing/plans'&&method==='GET')value={plans:[...plans.values()],links:[]};
  else if(path==='/v1/billing/plans'&&method==='POST'){value=JSON.parse(options.body);assert.equal(value.billing_cycles[0].total_cycles,0);const id=value.billing_cycles[0].frequency.interval_unit==='MONTH'?'P-MONTHLY123456789':'P-ANNUAL1234567890';value.id=id;if(badAmount)value.billing_cycles[0].pricing_scheme.fixed_price.value='999.00';plans.set(id,value);status=201;}
  else if(path.startsWith('/v1/billing/plans/'))value=plans.get(path.split('/').at(-1));
  else throw Error('Unexpected request');
  return{ok:status<400,status,json:async()=>value};
 };
 await vm.runInNewContext(source,{process:processMock,console:{log:v=>logs.push(v),error:v=>errors.push(v)},Buffer,URL,AbortSignal,fetch,setTimeout,clearTimeout});
 if(badAmount){assert.equal(processMock.exitCode,1);assert.ok(errors.length);assert.equal(logs.length,0);}
 else{assert.equal(processMock.exitCode,0);assert.deepEqual(errors,[]);assert.equal(plans.size,2);assert.ok(logs.at(-1).includes('PAYPAL_NEXO_ANNUAL_PLAN_ID'));if(existing)assert.equal(requests.filter(r=>r.method==='POST'&&r.path!=='/v1/oauth2/token').length,0);}
 assert.ok(!JSON.stringify([...logs,...errors]).includes('mock-secret'));assert.ok(!JSON.stringify([...logs,...errors]).includes('mock-access-token'));
 console.log('Mock PayPal provisioning:',existing?'reuse existing plans':badAmount?'reject incorrect amount':'create and verify plans','passed');
}
test('creates and verifies both recurring PayPal plans', () => scenario(false));
test('reuses existing plans without duplicate writes', () => scenario(true));
test('rejects a plan with incorrect billing terms', () => scenario(false, true));
