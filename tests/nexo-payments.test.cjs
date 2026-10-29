const { test } = require('node:test');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const assert=require('node:assert/strict');const fs=require('fs');const vm=require('vm');
const apiModule = { exports: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'api/nexo-plans.js'), 'utf8'), { module: apiModule, process, require: id => id.includes('nexo-pricing') ? require(path.join(root, 'js/nexo-pricing.js')) : ({ clientId: null, monthlyPlanId: null, annualPlanId: null }) });
const handler = apiModule.exports;
const pricing = require(path.join(root, 'js/nexo-pricing.js'));
test('quotes per-user monthly and annual totals with one free month', () => {
  for (const count of [1, 20, 50]) {
    const monthly = pricing.quote(count);
    const annual = pricing.quote(String(count), 'annual');
    assert.equal(monthly.total, count * 14);
    assert.equal(annual.total, count * 154);
    assert.equal(annual.savings, count * 14);
    assert.equal(annual.total + annual.savings, monthly.total * 12);
  }
  assert.equal(pricing.quote(20).total, 280);
  assert.equal(pricing.quote(20, 'annual').total, 3080);
  for (const value of ['', 0, -1, 1.5, 'abc', Infinity, Number.MAX_SAFE_INTEGER, null, undefined, {}]) assert.equal(pricing.quote(value), null);
});
const res=()=>({headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(data){this.data=data;return this}});
test('public plan configuration validates IDs and never returns a secret', () => {
const original={...process.env};
delete process.env.PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID;delete process.env.PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID;
process.env.PAYPAL_NEXO_MONTHLY_PLAN_ID='P-OLDFLATMONTH12345';process.env.PAYPAL_NEXO_ANNUAL_PLAN_ID='P-OLDFLATYEAR123456';
let response=res();handler({method:'GET'},response);assert.equal(response.data.plans.monthly.planId,null);assert.equal(response.data.plans.annual.unitAmount,'154.00');assert.equal(response.data.plans.annual.interval,'YEAR');assert.equal(response.data.pricingModel,'per_user_v1');assert.equal(response.data.plans.monthly.unitAmount,'14.00');assert.equal(response.data.plans.monthly.quantitySupported,true);
for(const key of ['PAYPAL_NEXO_MONTHLY_PLAN_ID','PAYPAL_NEXO_ANNUAL_PLAN_ID']) { if(original[key]===undefined)delete process.env[key];else process.env[key]=original[key]; }
process.env.PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID='P-MONTHLY123456789';process.env.PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID='P-ANNUAL1234567890';process.env.PAYPAL_API_CLIENT_SECRET='mock-secret-must-not-be-returned';
response=res();handler({method:'GET'},response);assert.equal(response.data.plans.monthly.planId,process.env.PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID);assert.ok(!JSON.stringify(response.data).includes('mock-secret'));assert.equal(response.headers['Cache-Control'],'no-store');
response=res();handler({method:'POST'},response);assert.equal(response.code,405);assert.equal(response.headers.Allow,'GET');
process.env.PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID='invalid';response=res();handler({method:'GET'},response);assert.equal(response.data.plans.monthly.planId,null);
for(const name of ['PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID','PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID','PAYPAL_API_CLIENT_SECRET']){if(original[name]===undefined)delete process.env[name];else process.env[name]=original[name]}
});
const source=fs.readFileSync(path.join(root, 'scripts/create-nexo-paypal-plans.cjs'),'utf8');
async function scenario(existing,badAmount=false,badQuantity=false){
 const logs=[],errors=[],requests=[];let product=existing?{id:'CASALABS-NEXO-USERS-V1',name:'Nexo por usuario',type:'SERVICE'}:null;const plans=new Map();
 const make=(name,unit,amount,id)=>({id,name,product_id:'CASALABS-NEXO-USERS-V1',status:'ACTIVE',quantity_supported:true,billing_cycles:[{frequency:{interval_unit:unit,interval_count:1},tenure_type:'REGULAR',total_cycles:0,pricing_scheme:{fixed_price:{value:amount,currency_code:'USD'}}}]});
 if(existing){plans.set('P-MONTHLY123456789',make('Nexo mensual por usuario','MONTH','14.00','P-MONTHLY123456789'));plans.set('P-ANNUAL1234567890',make('Nexo anual por usuario - un mes gratis','YEAR','154.00','P-ANNUAL1234567890'));}
 const processMock={argv:['node','script'],env:{PAYPAL_API_CLIENT_ID:'mock-client',PAYPAL_API_CLIENT_SECRET:'mock-secret'},exitCode:0};
 const fetch=async(url,options={})=>{const path=new URL(url).pathname;const method=options.method||'GET';requests.push({path,method});let value,status=200;
  if(path.endsWith('/oauth2/token'))value={access_token:'mock-access-token'};
  else if(path.includes('/catalogs/products/')){value=product;status=product?200:404;}
  else if(path==='/v1/catalogs/products'){product=JSON.parse(options.body);value=product;status=201;}
  else if(path==='/v1/billing/plans'&&method==='GET')value={plans:[...plans.values()],links:[]};
  else if(path==='/v1/billing/plans'&&method==='POST'){value=JSON.parse(options.body);assert.equal(value.billing_cycles[0].total_cycles,0);assert.equal(value.quantity_supported,true);const id=value.billing_cycles[0].frequency.interval_unit==='MONTH'?'P-MONTHLY123456789':'P-ANNUAL1234567890';value.id=id;if(badAmount)value.billing_cycles[0].pricing_scheme.fixed_price.value='999.00';if(badQuantity)value.quantity_supported=false;plans.set(id,value);status=201;}
  else if(path.startsWith('/v1/billing/plans/'))value=plans.get(path.split('/').at(-1));
  else throw Error('Unexpected request');
  return{ok:status<400,status,json:async()=>value};
 };
 await vm.runInNewContext(source,{process:processMock,console:{log:v=>logs.push(v),error:v=>errors.push(v)},Buffer,URL,AbortSignal,fetch,setTimeout,clearTimeout,require:id=>require(path.join(root,'js/nexo-pricing.js'))});
 if(badAmount||badQuantity){assert.equal(processMock.exitCode,1);assert.ok(errors.length);assert.equal(logs.length,0);}
 else{assert.equal(processMock.exitCode,0);assert.deepEqual(errors,[]);assert.equal(plans.size,2);assert.ok(logs.at(-1).includes('PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID'));if(existing)assert.equal(requests.filter(r=>r.method==='POST'&&r.path!=='/v1/oauth2/token').length,0);}
 assert.ok(!JSON.stringify([...logs,...errors]).includes('mock-secret'));assert.ok(!JSON.stringify([...logs,...errors]).includes('mock-access-token'));
 console.log('Mock PayPal provisioning:',existing?'reuse existing plans':badAmount?'reject incorrect amount':badQuantity?'reject missing quantity support':'create and verify plans','passed');
}
test('creates and verifies both recurring PayPal plans', () => scenario(false));
test('reuses existing plans without duplicate writes', () => scenario(true));
test('rejects a plan with incorrect billing terms', () => scenario(false, true));

test('rejects a PayPal plan that does not support quantities', () => scenario(false, false, true));
