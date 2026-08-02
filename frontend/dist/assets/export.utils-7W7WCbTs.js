import{c as s}from"./index-BJoRyFg_.js";/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=s("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]),p=(o,a="CardFlow_Transactions.csv")=>{if(!o||o.length===0){alert("No transactions available to export.");return}const i=["Transaction ID","Merchant","Category","Amount (USD)","Status","Date"],e=o.map(t=>[t.id,`"${t.merchant.replace(/"/g,'""')}"`,t.category,t.amount.toFixed(2),t.status,new Date(t.date).toISOString().split("T")[0]]),d="data:text/csv;charset=utf-8,"+[i.join(","),...e.map(t=>t.join(","))].join(`
`),r=encodeURI(d),n=document.createElement("a");n.setAttribute("href",r),n.setAttribute("download",a),document.body.appendChild(n),n.click(),document.body.removeChild(n)},m=(o,a,i="8821")=>{const e=window.open("","_blank");if(!e)return;const d=`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CardFlow Statement - ${o}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: center; border-b: 2px solid #3b82f6; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #1e3a8a; }
          .summary { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .amount { font-size: 28px; font-weight: bold; color: #2563eb; }
          .footer { margin-top: 50px; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CardFlow Enterprise</div>
          <div>Statement Period: <strong>${o}</strong></div>
        </div>

        <div class="summary">
          <h3>Account Summary</h3>
          <p>Card Number: <strong>•••• •••• •••• ${i}</strong></p>
          <p>Total Monthly Spend:</p>
          <div class="amount">$${a.toFixed(2)}</div>
          <p>Status: <span style="color: #10b981; font-weight: bold;">PAID IN FULL</span></p>
        </div>

        <div class="footer">
          CardFlow Financial Services • Official Monthly Billing Record • Generated on ${new Date().toLocaleDateString()}
        </div>
        <script>
          window.onload = function() { window.print(); };
        <\/script>
      </body>
    </html>
  `;e.document.write(d),e.document.close()};export{c as D,m as d,p as e};
