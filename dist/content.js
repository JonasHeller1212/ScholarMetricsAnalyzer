/* empty css                     */function g(){var n,r;return{name:((n=document.querySelector("#gsc_prf_in"))==null?void 0:n.textContent)||"",affiliation:((r=document.querySelector(".gsc_prf_il"))==null?void 0:r.textContent)||"",citations:Array.from(document.querySelectorAll("#gsc_rsb_st tr")).map(t=>{var e,i,o;return{metric:((e=t.querySelector("td:first-child"))==null?void 0:e.textContent)||"",all:((i=t.querySelector("td:nth-child(2)"))==null?void 0:i.textContent)||"",since2018:((o=t.querySelector("td:last-child"))==null?void 0:o.textContent)||""}}),publications:Array.from(document.querySelectorAll("#gsc_a_b .gsc_a_tr")).map(t=>{var e,i,o,l,d,a;return{title:((e=t.querySelector(".gsc_a_t a"))==null?void 0:e.textContent)||"",authors:((i=t.querySelector(".gsc_a_t .gsc_a_at"))==null?void 0:i.textContent)||"",venue:((o=t.querySelector(".gsc_a_t .gsc_a_v"))==null?void 0:o.textContent)||"",year:((l=t.querySelector(".gsc_a_y"))==null?void 0:l.textContent)||"",citations:parseInt(((d=t.querySelector(".gsc_a_c"))==null?void 0:d.textContent)||"0"),url:((a=t.querySelector(".gsc_a_t a"))==null?void 0:a.getAttribute("href"))||""}}),coauthors:Array.from(document.querySelectorAll("#gsc_rsb_co .gsc_rsb_a_desc")).map(t=>{var e,i,o;return{name:((e=t.querySelector(".gsc_rsb_a_desc a"))==null?void 0:e.textContent)||"",imageUrl:((i=t.querySelector("img"))==null?void 0:i.src)||"",profileUrl:((o=t.querySelector("a"))==null?void 0:o.href)||""}})}}function f(c){const n=c.publications.length,r={};let t=0,e=0;c.publications.forEach(s=>{s.year&&(r[s.year]=(r[s.year]||0)+1),e+=s.citations});const i=Object.keys(r),o=n/i.length,l=c.name.split(" ")[1];c.publications.forEach(s=>{s.authors.includes(l)&&(t+=Math.round(s.citations*.2))});const d=t/e*100,a=c.publications.filter(s=>s.citations>0).length/n*100;return{totalPublications:n,publicationsPerYear:o.toFixed(1),selfCitationRate:d.toFixed(1)+"%",sIndex:a.toFixed(1)+"%",hpIndex:Math.round(c.citations[0].all*.8),rcr:(e/n/10).toFixed(2)}}function x(c){const n=document.createElement("div");n.className="scholar-metrics-container",n.innerHTML=`
    <style>
      .scholar-metrics-container {
        margin: 20px 0;
        padding: 16px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.1);
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .metric-card {
        background: rgba(255, 255, 255, 0.9);
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.05);
      }
      .metric-title {
        font-size: 0.75rem;
        color: #64748b;
        margin-bottom: 4px;
      }
      .metric-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e40af;
      }
      .metrics-header {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    </style>
    <div class="metrics-grid">
      ${Object.entries(c).map(([t,e])=>`
        <div class="metric-card">
          <div class="metric-title">${t.replace(/([A-Z])/g," $1").trim()}</div>
          <div class="metric-value">${e}</div>
        </div>
      `).join("")}
    </div>
  `;const r=document.querySelector("#gsc_prf_i");r&&r.appendChild(n)}if(window.location.pathname.includes("/citations")){const c=g(),n=f(c);chrome.runtime.sendMessage({type:"PROFILE_DATA",data:{...c,...n}},r=>{chrome.runtime.sendMessage({type:"GET_METRICS"},t=>{t&&x(t)})}),c.coauthors.forEach(async r=>{var t,e,i;if(r.profileUrl)try{const l=await(await fetch(r.profileUrl)).text(),a=new DOMParser().parseFromString(l,"text/html"),s=((t=a.querySelector("#gsc_rsb_st tr:first-child td:nth-child(2)"))==null?void 0:t.textContent)||"0",p=((e=a.querySelector("#gsc_rsb_st tr:nth-child(2) td:nth-child(2)"))==null?void 0:e.textContent)||"0";r.citations=parseInt(s),r.hIndex=parseInt(p);const u=(i=document.querySelector(`a[href="${r.profileUrl}"]`))==null?void 0:i.parentElement;if(u){const m=document.createElement("div");m.className="coauthor-metrics",m.innerHTML=`
            <span class="text-sm text-gray-600">
              ${s} citations • h-index: ${p}
            </span>
          `,u.appendChild(m)}}catch(o){console.error("Error fetching co-author metrics:",o)}})}
//# sourceMappingURL=content.js.map
