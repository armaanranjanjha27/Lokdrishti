import { useState, useMemo, useEffect } from "react";

/* ── Fonts ─────────────────────────────────────────────────── */
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(_fl);
const _gs = document.createElement("style");
_gs.textContent = `
  *{box-sizing:border-box;} body{margin:0;background:#f2f0eb;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#ccc;border-radius:10px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes fillBar{from{width:0}to{width:var(--w)}}
  .fu{animation:fadeUp .35s ease forwards}
  .si{animation:scaleIn .28s ease forwards}
  input:focus,textarea:focus,select:focus{outline:none!important}
  .row-hover:hover{background:#f9f8f4!important}
  .card-hover:hover{box-shadow:0 6px 24px rgba(0,0,0,0.10)!important;transform:translateY(-2px)!important}
  .nav-desktop{display:flex;gap:1px;flex-wrap:wrap;}
  .nav-mobile-btn{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;}
  .mobile-menu{display:none;flex-direction:column;position:absolute;top:56px;left:0;right:0;background:#fff;border-bottom:1px solid #e6e3db;z-index:999;padding:8px 0;box-shadow:0 8px 24px rgba(0,0,0,0.1);}
  .mobile-menu.open{display:flex;}
  .mobile-menu button{padding:13px 24px;text-align:left;border:none;background:none;font-size:14px;cursor:pointer;color:#1c1917;font-family:'Sora',sans-serif;}
  .mobile-menu button:hover{background:#fdf0e6;color:#e07b39;}
  @media(max-width:768px){
    .nav-desktop{display:none!important;}
    .nav-mobile-btn{display:flex!important;align-items:center;justify-content:center;}
    .main-pad{padding:0 14px 80px!important;}
    .hero-flex{flex-direction:column!important;text-align:center!important;padding:22px 18px!important;gap:14px!important;}
    .hero-flex .hero-info{text-align:center!important;}
    .stats-row{grid-template-columns:repeat(2,1fr)!important;}
    .two-col{grid-template-columns:1fr!important;}
    .three-col{grid-template-columns:1fr 1fr!important;}
    .admin-bar{bottom:12px!important;right:12px!important;}
  }
  @media(max-width:420px){
    .three-col{grid-template-columns:1fr!important;}
    .stats-row{grid-template-columns:repeat(2,1fr)!important;}
  }
`;
document.head.appendChild(_gs);

/* ── Tokens ─────────────────────────────────────────────────── */
const C = {
  bg:"#f2f0eb", card:"#ffffff", border:"#e6e3db", border2:"#ede9e0",
  ink:"#1c1917", ink2:"#3d3a36", ink3:"#736f69", ink4:"#a8a29e",
  saffron:"#e07b39", saffronL:"#fdf0e6", saffronD:"#c4622a",
  green:"#16a34a", greenL:"#dcfce7", amber:"#d97706", amberL:"#fef3c7",
  blue:"#2563eb", blueL:"#eff6ff", red:"#dc2626", redL:"#fef2f2",
  purple:"#7c3aed", purpleL:"#f5f3ff", teal:"#0d9488", tealL:"#f0fdfa",
  serif:"'Playfair Display',Georgia,serif",
  sans:"'Sora',system-ui,sans-serif",
  mono:"'JetBrains Mono',monospace",
};

/* ── Helpers ────────────────────────────────────────────────── */
const fmt  = n => new Intl.NumberFormat("en-IN").format(n);
const fmtC = n => n>=1e7?`₹${(n/1e7).toFixed(2)} Cr`:n>=1e5?`₹${(n/1e5).toFixed(1)} L`:`₹${fmt(n)}`;
const fmtD = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const genTID = () => "LD-"+Math.random().toString(36).substr(2,4).toUpperCase()+"-"+Date.now().toString().slice(-4);
const CATS_ICONS = {Water:"💧",Infrastructure:"🛣️",Housing:"🏠",Sanitation:"🚿",Education:"📚",Health:"🏥",Agriculture:"🌾",General:"🔧"};

const ST = { Completed:{bg:C.greenL,tx:"#14532d",dot:C.green}, Ongoing:{bg:C.amberL,tx:"#78350f",dot:C.amber}, Approved:{bg:C.blueL,tx:"#1e3a8a",dot:C.blue}, Pending:{bg:"#f1f0ec",tx:C.ink3,dot:C.ink4} };
const GT = { Submitted:{bg:"#f1f0ec",tx:C.ink3,dot:C.ink4}, "Under Review":{bg:C.amberL,tx:"#78350f",dot:C.amber}, Resolved:{bg:C.greenL,tx:"#14532d",dot:C.green}, Rejected:{bg:C.redL,tx:"#7f1d1d",dot:C.red} };

/* ── Seed Data ──────────────────────────────────────────────── */
const LEADER0 = {
  name:"Rajendra Kumar Sharma", designation:"Gram Panchayat Pradhan",
  constituency:"Rampur Panchayat, Lucknow District", term:"2021 – 2026",
  bio:"Dedicated to transparent and inclusive governance. Serving Rampur with accountability and a vision for sustainable rural development.",
  phone:"98765-XXXXX", email:"pradhan.rampur@up.gov.in", photo:null,
};
const PROJECTS0 = [
  {id:1,scheme:"PMGSY Road Construction",panchayat:"Rampur",village:"Khargapur",budget:2500000,spent:2300000,beneficiaries:1200,start:"2022-03-01",completion:"2022-11-30",status:"Completed",category:"Infrastructure",beforeImg:null,afterImg:null,rating:4.2,ratings:24,
    reviews:[{id:1,name:"Ramesh K.",village:"Khargapur",stars:5,comment:"Bahut achha kaam hua, road bilkul smooth ho gayi.",date:"2022-12-10"},{id:2,name:"Priya S.",village:"Khargapur",stars:4,comment:"Road ki quality theek hai but footpath nahi bana.",date:"2023-01-05"},{id:3,name:"Mohan L.",village:"Khargapur",stars:4,comment:"Finally road fixed after years of potholes.",date:"2023-01-20"}],
    milestones:[{label:"Survey & Design",date:"2022-03-01",done:true},{label:"Tender Awarded",date:"2022-04-15",done:true},{label:"Foundation Work",date:"2022-06-01",done:true},{label:"Laying Complete",date:"2022-09-30",done:true},{label:"Final Inspection",date:"2022-11-30",done:true}]},
  {id:2,scheme:"Jal Jeevan Mission",panchayat:"Rampur",village:"Nayagaon",budget:1800000,spent:900000,beneficiaries:850,start:"2023-01-15",completion:"2023-12-31",status:"Ongoing",category:"Water",beforeImg:null,afterImg:null,rating:3.1,ratings:8,
    reviews:[{id:1,name:"Sunita D.",village:"Nayagaon",stars:3,comment:"Work started but many areas still without connection.",date:"2023-06-12"},{id:2,name:"Ajay M.",village:"Nayagaon",stars:3,comment:"Progress is slow, contractor not working regularly.",date:"2023-08-01"}],
    milestones:[{label:"Survey Completed",date:"2023-01-15",done:true},{label:"Pipe Purchase",date:"2023-02-28",done:true},{label:"Zone A Laying",date:"2023-04-30",done:true},{label:"Zone B Laying",date:"2023-08-31",done:false},{label:"Final Testing",date:"2023-12-31",done:false}]},
  {id:3,scheme:"PM Awas Yojana",panchayat:"Rampur",village:"Khargapur",budget:3200000,spent:3200000,beneficiaries:64,start:"2021-07-01",completion:"2022-06-30",status:"Completed",category:"Housing",beforeImg:null,afterImg:null,rating:4.6,ratings:18,
    reviews:[{id:1,name:"Geeta B.",village:"Khargapur",stars:5,comment:"Humare ghar ka sapna poora hua. Shukriya pradhan ji.",date:"2022-07-15"},{id:2,name:"Ramu T.",village:"Khargapur",stars:4,comment:"Good quality construction, very happy.",date:"2022-08-02"}],
    milestones:[{label:"Beneficiary Selection",date:"2021-07-01",done:true},{label:"Foundation Laid",date:"2021-09-01",done:true},{label:"Walls Completed",date:"2022-01-15",done:true},{label:"Roof & Finishing",date:"2022-04-30",done:true},{label:"Handover Done",date:"2022-06-30",done:true}]},
  {id:4,scheme:"Swachh Bharat Mission",panchayat:"Singhpur",village:"Singhpur",budget:750000,spent:750000,beneficiaries:320,start:"2022-06-01",completion:"2022-12-01",status:"Completed",category:"Sanitation",beforeImg:null,afterImg:null,rating:3.8,ratings:11,
    reviews:[{id:1,name:"Anita R.",village:"Singhpur",stars:4,comment:"Toilet construction was good, changed daily life.",date:"2023-01-10"}],
    milestones:[{label:"Survey & List",date:"2022-06-01",done:true},{label:"Material Supply",date:"2022-07-15",done:true},{label:"Construction Phase 1",date:"2022-09-30",done:true},{label:"Construction Phase 2",date:"2022-11-30",done:true},{label:"Verified & Closed",date:"2022-12-01",done:true}]},
  {id:5,scheme:"Anganwadi Renovation",panchayat:"Singhpur",village:"Barauli",budget:450000,spent:0,beneficiaries:180,start:"2024-01-01",completion:"2024-06-30",status:"Approved",category:"Education",beforeImg:null,afterImg:null,rating:0,ratings:0,reviews:[],
    milestones:[{label:"Approval Received",date:"2024-01-01",done:true},{label:"Tender Process",date:"2024-02-01",done:false},{label:"Construction Start",date:"2024-03-01",done:false},{label:"Completion",date:"2024-06-30",done:false}]},
  {id:6,scheme:"MGNREGS Water Tank",panchayat:"Rampur",village:"Nayagaon",budget:600000,spent:150000,beneficiaries:500,start:"2023-09-01",completion:"2024-03-31",status:"Ongoing",category:"Water",beforeImg:null,afterImg:null,rating:0,ratings:0,reviews:[],
    milestones:[{label:"Site Selection",date:"2023-09-01",done:true},{label:"Excavation",date:"2023-10-15",done:true},{label:"RCC Work",date:"2023-12-31",done:false},{label:"Pipe Laying",date:"2024-02-28",done:false},{label:"Completion",date:"2024-03-31",done:false}]},
  {id:7,scheme:"Solar Street Lights",panchayat:"Devpur",village:"Devpur",budget:920000,spent:920000,beneficiaries:1100,start:"2023-02-01",completion:"2023-08-31",status:"Completed",category:"Infrastructure",beforeImg:null,afterImg:null,rating:4.9,ratings:31,
    reviews:[{id:1,name:"Kamlesh P.",village:"Devpur",stars:5,comment:"Raat ko gaon mein ujala ho gaya! Bahut badiya.",date:"2023-09-05"},{id:2,name:"Laxmi D.",village:"Devpur",stars:5,comment:"Ab raat ko bahar nikalna safe hai. Thank you.",date:"2023-09-20"},{id:3,name:"Vikram S.",village:"Devpur",stars:5,comment:"Every street covered. Excellent work.",date:"2023-10-01"}],
    milestones:[{label:"Survey Done",date:"2023-02-01",done:true},{label:"Order Placed",date:"2023-03-15",done:true},{label:"Installation Phase 1",date:"2023-05-31",done:true},{label:"Installation Phase 2",date:"2023-07-31",done:true},{label:"All Lights Live",date:"2023-08-31",done:true}]},
  {id:8,scheme:"Community Health Centre",panchayat:"Devpur",village:"Ramkola",budget:1200000,spent:0,beneficiaries:700,start:"2024-03-01",completion:"2024-12-31",status:"Pending",category:"Health",beforeImg:null,afterImg:null,rating:0,ratings:0,reviews:[],
    milestones:[{label:"DPR Submitted",date:"2024-03-01",done:false},{label:"Approval Expected",date:"2024-04-15",done:false},{label:"Construction Start",date:"2024-06-01",done:false},{label:"Completion",date:"2024-12-31",done:false}]},
];
const GRIEVANCES0 = [
  {id:1,ticketId:"LD-A3F2-2891",name:"Ramesh V.",mobile:"***6789",email:"",village:"Khargapur",category:"Road Repair",description:"Main road has large potholes near school entrance causing daily hazard for students.",image:null,status:"Under Review",date:"2024-01-10"},
  {id:2,ticketId:"LD-B7D4-1023",name:"Sunita D.",mobile:"***4321",email:"",village:"Nayagaon",category:"Water Supply",description:"No piped water supply for 3 consecutive weeks in our area.",image:null,status:"Resolved",date:"2024-01-05"},
  {id:3,ticketId:"LD-C9E1-3345",name:"Mohan L.",mobile:"***8765",email:"",village:"Singhpur",category:"Electricity",description:"Street lights not functioning for 2 months along main road.",image:null,status:"Submitted",date:"2024-02-01"},
];
const MEETINGS0 = [
  {id:1,title:"Monthly Gram Sabha – January 2024",date:"2024-01-15",type:"Gram Sabha",venue:"Panchayat Bhawan, Rampur",agenda:["Review of PMGSY road status","Water supply complaints","PM Awas beneficiary list finalization"],decisions:["Road contractor issued notice for delay","JJM pipe work to resume by Feb 15","32 new beneficiaries approved for PMAY"],attendance:87,totalMembers:120,status:"Completed",minutes:"Full attendance noted. Sarpanch presided. All agenda items discussed."},
  {id:2,title:"Special Meeting – Scheme Planning Q1 2024",date:"2024-02-10",type:"Special",venue:"Block Office, Lucknow",agenda:["2024-25 budget allocation","New scheme proposals","Audit report review"],decisions:["₹45L allocated for road repair","3 new tubewell proposals approved","Audit objections to be cleared by March"],attendance:62,totalMembers:120,status:"Completed",minutes:"Quorum achieved. Budget passed unanimously."},
  {id:3,title:"Quarterly Review Meeting – March 2024",date:"2024-03-20",type:"Review",venue:"Panchayat Bhawan, Rampur",agenda:["Project status review","Grievance resolution update","Election of ward committee heads"],decisions:[],attendance:0,totalMembers:120,status:"Upcoming",minutes:""},
];
const NOTICES0 = [
  {id:1,title:"PM Awas Yojana – Applications Open",date:"2024-02-01",category:"Scheme",content:"Applications invited from eligible BPL families for housing under PMAY-G. Last date: 31 March 2024.",important:true},
  {id:2,title:"Tender Notice – Road Repair Work",date:"2024-01-25",category:"Tender",content:"Sealed tenders invited for repair of Khargapur-Nayagaon road. Estimated cost ₹8.5 lakhs. Deadline: 15 Feb 2024.",important:false},
  {id:3,title:"Gram Sabha – Mandatory Attendance Notice",date:"2024-01-10",category:"Meeting",content:"All ward members directed to attend the monthly Gram Sabha on 15 January 2024 at 10 AM.",important:true},
  {id:4,title:"Water Connection Subsidy – Apply Now",date:"2024-01-05",category:"Scheme",content:"Households not yet covered under JJM can apply for subsidised water connection. Visit panchayat office with Aadhaar and land papers.",important:false},
];
const POLLS0 = [
  {id:1,question:"Aapke hisaab se Panchayat mein sabse pehle kaunsa kaam hona chahiye?",options:["Road repair","Pani ki supply","Streetlights","School renovation"],votes:[42,67,31,25],active:true,created:"2024-02-01",endsOn:"2024-03-01",totalVoters:165},
  {id:2,question:"Gram Sabha meetings ke liye sabse convenient time kaunsa hai?",options:["Sunday subah 9–11am","Saturday dopahar 2–4pm","Sunday sham 4–6pm"],votes:[88,34,55],active:false,created:"2024-01-01",endsOn:"2024-01-31",totalVoters:177},
];
const SCHEMES_ELIGIBILITY = [
  {name:"PM Awas Yojana (Gramin)",icon:"🏠",desc:"Free housing for homeless/kutcha house families",criteria:{maxIncome:300000,category:["General","OBC","SC","ST"],landOwner:false},benefit:"₹1.2 – 1.3 Lakh subsidy"},
  {name:"MGNREGS",icon:"⛏️",desc:"Guaranteed 100 days of wage employment",criteria:{maxIncome:999999,category:["General","OBC","SC","ST"],landOwner:null},benefit:"₹267/day guaranteed wage"},
  {name:"PM Kisan Samman Nidhi",icon:"🌾",desc:"Direct income support to farmer families",criteria:{maxIncome:999999,category:["General","OBC","SC","ST"],landOwner:true},benefit:"₹6,000/year in 3 installments"},
  {name:"Ayushman Bharat",icon:"🏥",desc:"Free health insurance coverage",criteria:{maxIncome:500000,category:["General","OBC","SC","ST"],landOwner:null},benefit:"₹5 Lakh/year health cover"},
  {name:"Swachh Bharat Mission (Gramin)",icon:"🚿",desc:"Free toilet construction for households",criteria:{maxIncome:999999,category:["General","OBC","SC","ST"],landOwner:null},benefit:"₹12,000 one-time support"},
  {name:"SC/ST Scholarship",icon:"📚",desc:"Education scholarship for SC/ST students",criteria:{maxIncome:250000,category:["SC","ST"],landOwner:null},benefit:"₹15,000 – ₹25,000/year"},
];

/* ── Shared UI ──────────────────────────────────────────────── */
const Badge = ({status,dict,size="sm"}) => {
  const s=(dict||{})[status]||{bg:"#f1f0ec",tx:C.ink3,dot:C.ink4};
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:size==="sm"?"4px 10px":"5px 14px",borderRadius:99,background:s.bg,color:s.tx,fontSize:size==="sm"?11:13,fontFamily:C.mono,fontWeight:500,whiteSpace:"nowrap"}}>
      <span style={{width:size==="sm"?5:7,height:size==="sm"?5:7,borderRadius:"50%",background:s.dot,flexShrink:0}}/>
      {status}
    </span>
  );
};
const Card = ({children,style:sx={},onClick,className=""}) => (
  <div className={className} onClick={onClick} style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",overflow:"hidden",transition:"all .2s",...sx}}>
    {children}
  </div>
);
const SectionTitle = ({children,sub}) => (
  <div style={{marginBottom:20}}>
    <h2 style={{fontFamily:C.serif,fontSize:26,fontWeight:700,margin:0,letterSpacing:"-0.02em",color:C.ink}}>{children}</h2>
    {sub&&<p style={{color:C.ink3,fontSize:13,margin:"4px 0 0",fontWeight:300}}>{sub}</p>}
  </div>
);
const Label = ({children}) => (
  <label style={{fontSize:10,fontFamily:C.mono,color:C.ink3,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}}>{children}</label>
);
const Field = ({label,value,onChange,type="text",placeholder="",rows,disabled}) => (
  <div style={{display:"flex",flexDirection:"column"}}>
    {label&&<Label>{label}</Label>}
    {rows?(
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} disabled={disabled}
        style={{background:disabled?"#fafaf8":"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,resize:"vertical",transition:"border-color .15s",fontWeight:300,lineHeight:1.65}}
        onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
    ):(
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{background:disabled?"#fafaf8":"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,transition:"border-color .15s",fontWeight:300}}
        onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
    )}
  </div>
);
const SelF = ({label,value,onChange,options}) => (
  <div style={{display:"flex",flexDirection:"column"}}>
    {label&&<Label>{label}</Label>}
    <select value={value} onChange={onChange}
      style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,cursor:"pointer",transition:"border-color .15s"}}
      onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}>
      {options.map(o=>typeof o==="string"?<option key={o}>{o}</option>:<option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);
const Btn = ({children,onClick,variant="primary",disabled,full,sm,style:sx={}}) => {
  const vars = {
    primary:  {bg:`linear-gradient(135deg,${C.saffron},${C.saffronD})`,cl:"#fff",bd:"none",sh:`0 2px 10px rgba(224,123,57,.32)`},
    secondary:{bg:"#fff",cl:C.ink,bd:`1.5px solid ${C.border}`,sh:"none"},
    ghost:    {bg:"transparent",cl:C.ink3,bd:"none",sh:"none"},
    danger:   {bg:C.redL,cl:C.red,bd:`1.5px solid #fca5a5`,sh:"none"},
    teal:     {bg:`linear-gradient(135deg,${C.teal},#0f766e)`,cl:"#fff",bd:"none",sh:`0 2px 10px rgba(13,148,136,.28)`},
  };
  const v=vars[variant]||vars.primary;
  return(
    <button onClick={disabled?undefined:onClick}
      style={{padding:sm?"7px 14px":"10px 22px",borderRadius:10,fontSize:sm?12:13,fontFamily:C.sans,cursor:disabled?"not-allowed":"pointer",
        fontWeight:500,transition:"all .15s",opacity:disabled?.45:1,width:full?"100%":undefined,background:v.bg,color:v.cl,border:v.bd,boxShadow:disabled?"none":v.sh,...sx}}>
      {children}
    </button>
  );
};
const ProgressBar = ({value,max,color=C.saffron,h=6}) => (
  <div style={{background:C.border2,borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${max>0?Math.min(100,value/max*100):0}%`,background:color,borderRadius:99,transition:"width .7s ease"}}/>
  </div>
);
const MiniBar = ({data,color=C.saffron}) => {
  const max=Math.max(...data.map(d=>d.v),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:90,paddingTop:24}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:10,fontFamily:C.mono,color:C.ink4}}>{d.top||""}</span>
          <div style={{width:"100%",background:C.border2,borderRadius:"4px 4px 0 0",height:56,display:"flex",alignItems:"flex-end"}}>
            <div style={{width:"100%",height:`${(d.v/max)*100}%`,background:color,borderRadius:"4px 4px 0 0",minHeight:3,transition:"height .6s ease"}}/>
          </div>
          <span style={{fontSize:9,fontFamily:C.mono,color:C.ink4,textAlign:"center",maxWidth:52,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.l}</span>
        </div>
      ))}
    </div>
  );
};
const Div = () => <div style={{height:1,background:C.border2}}/>;

/* ── Stars component ────────────────────────────────────────── */
const Stars = ({val,count,size=14}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:3}}>
    {[1,2,3,4,5].map(i=>(
      <span key={i} style={{fontSize:size,color:i<=Math.round(val)?C.amber:"#ddd",lineHeight:1}}>★</span>
    ))}
    {val>0&&<span style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginLeft:3}}>{val.toFixed(1)} ({count})</span>}
    {val===0&&count===0&&<span style={{fontSize:11,fontFamily:C.mono,color:C.ink4,marginLeft:3}}>No ratings yet</span>}
  </span>
);

/* ── Timeline component (for project milestones) ────────────── */
const Timeline = ({milestones}) => {
  const done = milestones.filter(m=>m.done).length;
  const pct  = milestones.length ? Math.round(done/milestones.length*100) : 0;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:11,fontFamily:C.mono,color:C.ink3,letterSpacing:"0.05em",textTransform:"uppercase"}}>Project Milestones</span>
        <span style={{fontSize:12,fontFamily:C.mono,color:pct===100?C.green:C.saffron,fontWeight:600}}>{pct}% complete</span>
      </div>
      <div style={{position:"relative",paddingLeft:28}}>
        {/* vertical line */}
        <div style={{position:"absolute",left:10,top:8,bottom:8,width:2,background:C.border2,borderRadius:2}}/>
        <div style={{position:"absolute",left:10,top:8,width:2,background:C.green,borderRadius:2,
          height:`${done>0?(done-1)/(milestones.length-1||1)*100:0}%`,transition:"height .8s ease"}}/>
        {milestones.map((m,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:i<milestones.length-1?18:0,position:"relative"}}>
            {/* dot */}
            <div style={{position:"absolute",left:-22,top:2,width:14,height:14,borderRadius:"50%",
              background:m.done?C.green:C.card,border:`2px solid ${m.done?C.green:C.border}`,
              display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,flexShrink:0,transition:"all .3s"}}>
              {m.done&&<span style={{fontSize:7,color:"#fff",fontWeight:900}}>✓</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:m.done?500:400,color:m.done?C.ink:C.ink3}}>{m.label}</div>
              <div style={{fontSize:10,fontFamily:C.mono,color:m.done?C.green:C.ink4,marginTop:2}}>{fmtD(m.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Poll Result Bar ────────────────────────────────────────── */
const PollBar = ({label,votes,total,color,winner}) => {
  const pct = total>0 ? Math.round(votes/total*100) : 0;
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:13,color:winner?C.ink:C.ink2,fontWeight:winner?600:400,display:"flex",alignItems:"center",gap:6}}>
          {winner&&<span style={{fontSize:12}}>🏆</span>}{label}
        </span>
        <span style={{fontSize:12,fontFamily:C.mono,color:winner?color:C.ink3,fontWeight:winner?600:400}}>{votes} votes · {pct}%</span>
      </div>
      <div style={{background:C.border2,borderRadius:99,height:10,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:winner?`linear-gradient(90deg,${color},${color}aa)`:C.border,
          borderRadius:99,transition:"width .8s ease",boxShadow:winner?`0 0 8px ${color}66`:"none"}}/>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════════════════════════════ */
function Admin({data,setData,onLogout}) {
  const [tab,setTab]   = useState("dash");
  const [ld,setLd]     = useState({...data.leader});
  const [photo,setPh]  = useState(data.leader.photo);
  const [pScr,setPScr] = useState(null);
  const [mScr,setMScr] = useState(null);
  const [gf,setGf]     = useState(""); const [gs,setGs] = useState("");
  const [csvMsg,setCsvMsg] = useState("");

  const st = useMemo(()=>{
    const p=data.projects;
    return{total:p.length,comp:p.filter(x=>x.status==="Completed").length,ong:p.filter(x=>x.status==="Ongoing").length,
      budget:p.reduce((a,x)=>a+x.budget,0),spent:p.reduce((a,x)=>a+x.spent,0),benef:p.reduce((a,x)=>a+x.beneficiaries,0)};
  },[data.projects]);

  const onPhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPh(ev.target.result);r.readAsDataURL(f);};
  const saveLeader=()=>{setData(d=>({...d,leader:{...ld,photo}}));alert("✓ Profile published!");};
  const saveProj=p=>{
    if(p.id) setData(d=>({...d,projects:d.projects.map(x=>x.id===p.id?p:x)}));
    else setData(d=>({...d,projects:[...d.projects,{...p,id:Date.now(),rating:0,ratings:0,reviews:[],milestones:p.milestones||[]}]}));
    setPScr(null);
  };
  const delProj=id=>{if(!confirm("Delete?"))return;setData(d=>({...d,projects:d.projects.filter(x=>x.id!==id)}));};
  const saveMeeting=m=>{if(m.id)setData(d=>({...d,meetings:d.meetings.map(x=>x.id===m.id?m:x)}));else setData(d=>({...d,meetings:[...d.meetings,{...m,id:Date.now()}]}));setMScr(null);};
  const addNotice=n=>setData(d=>({...d,notices:[{...n,id:Date.now(),date:new Date().toISOString().split("T")[0]},...d.notices]}));
  const onCSV=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{
      const lines=ev.target.result.trim().split("\n");
      const hdrs=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/ /g,"_"));
      const rows=lines.slice(1).map((l,i)=>{
        const v=l.split(",");const o={};hdrs.forEach((h,idx)=>o[h]=v[idx]?.trim()||"");
        return{id:Date.now()+i,scheme:o.scheme_name||o.scheme||"",panchayat:o.panchayat||"",village:o.village||"",
          budget:parseFloat(o.budget_allocated||0),spent:parseFloat(o.budget_spent||0),beneficiaries:parseInt(o.beneficiary_count||0),
          start:o.start_date||"",completion:o.completion_date||"",status:o.status||"Pending",category:o.category||"General",
          beforeImg:null,afterImg:null,rating:0,ratings:0,reviews:[],milestones:[]};
      });
      setData(d=>({...d,projects:[...d.projects,...rows]}));
      setCsvMsg(`✓ ${rows.length} projects imported.`);setTimeout(()=>setCsvMsg(""),4000);
    };r.readAsText(f);
  };
  const filtG=data.grievances.filter(g=>(!gf||g.status===gf)&&(!gs||g.village.toLowerCase().includes(gs.toLowerCase())||g.mobile.includes(gs)||g.ticketId?.toLowerCase().includes(gs.toLowerCase())));

  // Poll admin helpers
  const addPoll=p=>setData(d=>({...d,polls:[{...p,id:Date.now(),votes:p.options.map(()=>0),created:new Date().toISOString().split("T")[0],totalVoters:0},...(d.polls||[])]}));
  const togglePoll=id=>setData(d=>({...d,polls:d.polls.map(p=>p.id===id?{...p,active:!p.active}:p)}));
  const delPoll=id=>{if(!confirm("Delete poll?"))return;setData(d=>({...d,polls:d.polls.filter(p=>p.id!==id)}));};

  const TABS=[["dash","📊","Dashboard"],["leader","👤","Leadership"],["projects","🏗","Projects"],["contractors","👷","Contractors"],["notif","🔔","Notifications"],["meetings","📋","Meetings"],["notices","📢","Notices"],["polls","🗳️","Polls"],["bulk","📥","Bulk Upload"],["griev","📬","Grievances"]];

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:C.sans,color:C.ink}}>
      {/* Sidebar */}
      <div style={{width:220,background:C.ink,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"26px 20px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{fontFamily:C.serif,fontSize:18,fontWeight:700,color:"#fff",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>👁️</span> LokDrishti
          </div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontFamily:C.mono,marginTop:3,letterSpacing:"0.12em"}}>ADMIN PANEL</div>
        </div>
        <nav style={{padding:"10px 0",flex:1,overflowY:"auto"}}>
          {TABS.map(([id,ic,l])=>(
            <button key={id} onClick={()=>{setTab(id);setPScr(null);setMScr(null);}}
              style={{width:"100%",textAlign:"left",padding:"10px 20px",background:tab===id?"rgba(224,123,57,0.18)":"none",
                border:"none",borderLeft:tab===id?`3px solid ${C.saffron}`:"3px solid transparent",
                color:tab===id?"#fff":"rgba(255,255,255,0.42)",fontSize:13,cursor:"pointer",transition:"all .15s",fontFamily:C.sans,fontWeight:tab===id?500:400,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:15}}>{ic}</span>{l}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
          <Btn onClick={onLogout} variant="secondary" style={{width:"100%",fontSize:12,padding:"8px"}}>← Public Site</Btn>
        </div>
      </div>

      {/* Main content */}
      <div style={{flex:1,overflow:"auto",padding:"30px 34px",background:"#f0ede6"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dash"&&(
          <div className="fu">
            <SectionTitle sub="Real-time overview of all governance activity">Dashboard Overview</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
              {[["Total Projects",st.total,"🏗",C.blue],["Completed",st.comp,"✅",C.green],["Ongoing",st.ong,"⚙️",C.amber],
                ["Budget Allocated",fmtC(st.budget),"💰",C.saffron],["Budget Utilized",fmtC(st.spent),"📊",C.purple],
                ["Beneficiaries",fmt(st.benef),"👥",C.green]].map(([l,v,ic,cl])=>(
                <Card key={l} style={{padding:"20px 18px"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${cl}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:12}}>{ic}</div>
                  <div style={{fontFamily:C.serif,fontSize:24,fontWeight:700,color:cl,lineHeight:1,marginBottom:4}}>{v}</div>
                  <div style={{fontSize:12,color:C.ink3}}>{l}</div>
                </Card>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16,marginBottom:16}}>
              <Card style={{padding:22}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:2,letterSpacing:"0.06em",textTransform:"uppercase"}}>Projects by Category</div>
                <MiniBar data={[...new Set(data.projects.map(p=>p.category))].map(cat=>{const c=data.projects.filter(p=>p.category===cat).length;return{l:cat,v:c,top:c};})}/>
              </Card>
              <Card style={{padding:22}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:16,letterSpacing:"0.06em",textTransform:"uppercase"}}>Status Breakdown</div>
                {["Completed","Ongoing","Approved","Pending"].map(s=>{
                  const c=data.projects.filter(x=>x.status===s).length;
                  const pct=data.projects.length?Math.round(c/data.projects.length*100):0;
                  return(
                    <div key={s} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12,alignItems:"center"}}>
                        <span style={{color:C.ink2,display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:ST[s]?.dot,display:"inline-block"}}/>{s}</span>
                        <span style={{fontFamily:C.mono,fontSize:11,color:C.ink4}}>{c} · {pct}%</span>
                      </div>
                      <ProgressBar value={c} max={data.projects.length} color={ST[s]?.dot||C.saffron}/>
                    </div>
                  );
                })}
              </Card>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14}}>
              {[["Pending Grievances",data.grievances.filter(g=>g.status==="Submitted"||g.status==="Under Review").length,C.amber,"📬"],
                ["Upcoming Meetings",data.meetings.filter(m=>m.status==="Upcoming").length,C.blue,"📋"],
                ["Active Polls",(data.polls||[]).filter(p=>p.active).length,C.teal,"🗳️"],
                ["Total Reviews",data.projects.reduce((a,p)=>a+(p.reviews||[]).length,0),C.purple,"⭐"]].map(([l,v,cl,ic])=>(
                <Card key={l} style={{padding:18}}>
                  <div style={{fontSize:20,marginBottom:8}}>{ic}</div>
                  <div style={{fontFamily:C.serif,fontSize:26,fontWeight:700,color:cl}}>{v}</div>
                  <div style={{fontSize:12,color:C.ink3,marginTop:4}}>{l}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── LEADERSHIP ── */}
        {tab==="leader"&&(
          <div className="fu" style={{maxWidth:600}}>
            <SectionTitle sub="Changes reflect instantly on public site">Leadership Profile</SectionTitle>
            <Card>
              <div style={{padding:28}}>
                <div style={{display:"flex",gap:22,marginBottom:22}}>
                  <div style={{flexShrink:0}}>
                    <div style={{width:84,height:84,borderRadius:"50%",background:"#f0ede6",border:`3px solid ${C.saffron}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {photo?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:32,color:C.ink4}}>👤</span>}
                    </div>
                    <label style={{display:"block",marginTop:7,textAlign:"center",fontSize:10,fontFamily:C.mono,color:C.saffron,cursor:"pointer",letterSpacing:"0.05em"}}>
                      Upload Photo<input type="file" accept="image/*" onChange={onPhoto} style={{display:"none"}}/>
                    </label>
                  </div>
                  <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {[["Name","name"],["Designation","designation"],["Constituency","constituency"],["Term","term"],["Phone","phone"],["Email","email"]].map(([l,k])=>(
                      <Field key={k} label={l} value={ld[k]||""} onChange={e=>setLd(d=>({...d,[k]:e.target.value}))}/>
                    ))}
                  </div>
                </div>
                <Field label="Bio / About" value={ld.bio} onChange={e=>setLd(d=>({...d,bio:e.target.value}))} rows={3}/>
              </div>
              <div style={{padding:"14px 28px",borderTop:`1px solid ${C.border}`,background:"#fafaf8",display:"flex",justifyContent:"flex-end"}}>
                <Btn onClick={saveLeader}>💾 Save & Publish</Btn>
              </div>
            </Card>
          </div>
        )}

        {/* ── PROJECTS LIST ── */}
        {tab==="projects"&&!pScr&&(
          <div className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
              <SectionTitle sub={`${data.projects.length} projects total`}>Development Works</SectionTitle>
              <Btn onClick={()=>setPScr({scheme:"",panchayat:"",village:"",budget:"",spent:"",beneficiaries:"",start:"",completion:"",status:"Pending",category:"Infrastructure",beforeImg:null,afterImg:null,milestones:[]})}>+ Add Project</Btn>
            </div>
            <Card>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#fafaf8",borderBottom:`1px solid ${C.border}`}}>
                      {["Scheme","Village","Budget","Spent","Benef.","Rating","Status",""].map(h=>(
                        <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:9,fontFamily:C.mono,color:C.ink3,fontWeight:500,letterSpacing:"0.07em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.projects.map((p,i)=>(
                      <tr key={p.id} className="row-hover" style={{borderBottom:i<data.projects.length-1?`1px solid ${C.border2}`:"none"}}>
                        <td style={{padding:"11px 16px",fontWeight:500,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{CATS_ICONS[p.category]||"🔧"} {p.scheme}</td>
                        <td style={{padding:"11px 16px",color:C.ink3,fontSize:12,fontFamily:C.mono}}>{p.village}</td>
                        <td style={{padding:"11px 16px",fontFamily:C.mono,fontSize:12}}>{fmtC(p.budget)}</td>
                        <td style={{padding:"11px 16px",fontFamily:C.mono,fontSize:12}}>{fmtC(p.spent)}</td>
                        <td style={{padding:"11px 16px",fontFamily:C.mono,fontSize:12}}>{fmt(p.beneficiaries)}</td>
                        <td style={{padding:"11px 16px"}}><Stars val={p.rating||0} count={p.ratings||0}/></td>
                        <td style={{padding:"11px 16px"}}><Badge status={p.status} dict={ST}/></td>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{display:"flex",gap:5}}>
                            <Btn sm variant="secondary" onClick={()=>setPScr({...p})}>Edit</Btn>
                            <Btn sm variant="danger" onClick={()=>delProj(p.id)}>Del</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
        {tab==="projects"&&pScr&&(
          <div className="fu">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
              <Btn variant="ghost" onClick={()=>setPScr(null)} style={{padding:"6px 0",fontSize:12}}>← Back</Btn>
              <SectionTitle>{pScr.id?"Edit Project":"New Project"}</SectionTitle>
            </div>
            <AdminProjForm proj={pScr} onSave={saveProj} onCancel={()=>setPScr(null)}/>
          </div>
        )}

        {/* ── MEETINGS ── */}
        {tab==="meetings"&&!mScr&&(
          <div className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
              <SectionTitle sub="Gram Sabha & panchayat meeting records">Meeting Records</SectionTitle>
              <Btn onClick={()=>setMScr({title:"",date:"",type:"Gram Sabha",venue:"",agenda:[""],decisions:[""],attendance:"",totalMembers:"",status:"Upcoming",minutes:""})}>+ Add Meeting</Btn>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {data.meetings.map(m=>(
                <Card key={m.id} style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:10,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontSize:11,fontFamily:C.mono,color:C.saffron,background:C.saffronL,padding:"2px 9px",borderRadius:6}}>{m.type}</span>
                        <Badge status={m.status} dict={{Completed:{bg:C.greenL,tx:"#14532d",dot:C.green},Upcoming:{bg:C.blueL,tx:"#1e3a8a",dot:C.blue}}}/>
                        <span style={{fontSize:12,fontFamily:C.mono,color:C.ink4}}>{fmtD(m.date)}</span>
                      </div>
                      <div style={{fontWeight:600,fontSize:15,marginBottom:2}}>{m.title}</div>
                      <div style={{fontSize:12,color:C.ink3}}>📍 {m.venue}</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <Btn sm variant="secondary" onClick={()=>setMScr({...m})}>Edit</Btn>
                      <Btn sm variant="danger" onClick={()=>setData(d=>({...d,meetings:d.meetings.filter(x=>x.id!==m.id)}))}>Del</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {tab==="meetings"&&mScr&&(
          <div className="fu">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
              <Btn variant="ghost" onClick={()=>setMScr(null)} style={{padding:"6px 0",fontSize:12}}>← Back</Btn>
              <SectionTitle>{mScr.id?"Edit Meeting":"New Meeting"}</SectionTitle>
            </div>
            <MeetingForm meet={mScr} onSave={saveMeeting} onCancel={()=>setMScr(null)}/>
          </div>
        )}

        {/* ── NOTICES ── */}
        {tab==="notices"&&(
          <div className="fu">
            <SectionTitle sub="Public announcements and notices">Notice Board Management</SectionTitle>
            <AdminNoticeForm onAdd={addNotice}/>
            <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:10}}>
              {data.notices.map(n=>(
                <Card key={n.id} style={{padding:18,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                      {n.important&&<span style={{fontSize:10,background:C.redL,color:C.red,padding:"2px 8px",borderRadius:6,fontFamily:C.mono,fontWeight:500}}>IMPORTANT</span>}
                      <span style={{fontSize:10,background:C.blueL,color:C.blue,padding:"2px 8px",borderRadius:6,fontFamily:C.mono}}>{n.category}</span>
                      <span style={{fontSize:11,fontFamily:C.mono,color:C.ink4}}>{n.date}</span>
                    </div>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>{n.title}</div>
                    <div style={{fontSize:12,color:C.ink3,lineHeight:1.6}}>{n.content}</div>
                  </div>
                  <Btn sm variant="danger" style={{marginLeft:16}} onClick={()=>setData(d=>({...d,notices:d.notices.filter(x=>x.id!==n.id)}))}>Remove</Btn>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── POLLS ADMIN ── */}
        {tab==="polls"&&(
          <div className="fu">
            <SectionTitle sub="Create and manage citizen polls">Citizen Polls</SectionTitle>
            <AdminPollForm onAdd={addPoll}/>
            <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:12}}>
              {(data.polls||[]).map(poll=>{
                const total=poll.votes.reduce((a,v)=>a+v,0)||1;
                const maxV=Math.max(...poll.votes);
                return(
                  <Card key={poll.id} style={{padding:22}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                          <span style={{fontSize:10,fontFamily:C.mono,background:poll.active?C.tealL:C.border2,color:poll.active?C.teal:C.ink3,padding:"2px 9px",borderRadius:6,fontWeight:500}}>{poll.active?"🟢 ACTIVE":"⚫ CLOSED"}</span>
                          <span style={{fontSize:11,fontFamily:C.mono,color:C.ink4}}>{poll.totalVoters} voters</span>
                        </div>
                        <div style={{fontWeight:600,fontSize:15}}>{poll.question}</div>
                      </div>
                      <div style={{display:"flex",gap:6,marginLeft:16}}>
                        <Btn sm variant={poll.active?"secondary":"teal"} onClick={()=>togglePoll(poll.id)}>{poll.active?"Close Poll":"Reopen"}</Btn>
                        <Btn sm variant="danger" onClick={()=>delPoll(poll.id)}>Del</Btn>
                      </div>
                    </div>
                    {poll.options.map((opt,i)=>(
                      <PollBar key={i} label={opt} votes={poll.votes[i]} total={total} color={C.saffron} winner={poll.votes[i]===maxV&&maxV>0}/>
                    ))}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BULK ── */}
        {tab==="bulk"&&(
          <div className="fu" style={{maxWidth:560}}>
            <SectionTitle sub="Import multiple projects via CSV file">Bulk Upload</SectionTitle>
            <Card style={{padding:26}}>
              <div style={{marginBottom:18,padding:"13px 16px",background:"#fafaf8",borderRadius:10,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>Required Columns</div>
                <div style={{fontSize:12,fontFamily:C.mono,color:C.ink3,lineHeight:1.9}}>scheme_name, panchayat, village, budget_allocated, budget_spent, beneficiary_count, start_date, completion_date, status, category</div>
              </div>
              <label style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"32px 20px",border:`2px dashed ${C.border}`,borderRadius:12,cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.saffron;e.currentTarget.style.background=C.saffronL;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}>
                <span style={{fontSize:32}}>📁</span>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:500,color:C.ink,marginBottom:3}}>Select or drag CSV file</div>
                  <div style={{fontSize:12,color:C.ink3}}>Supported: .csv only</div>
                </div>
                <input type="file" accept=".csv" onChange={onCSV} style={{display:"none"}}/>
              </label>
              {csvMsg&&<div style={{marginTop:14,padding:"10px 14px",background:C.greenL,border:`1px solid #86efac`,borderRadius:9,color:"#14532d",fontSize:12,fontFamily:C.mono}}>{csvMsg}</div>}
            </Card>
          </div>
        )}

        {/* ── GRIEVANCES ── */}
        {tab==="griev"&&(
          <div className="fu">
            <SectionTitle sub="Manage and respond to citizen grievances">Grievance Management</SectionTitle>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <select value={gf} onChange={e=>setGf(e.target.value)}
                style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"8px 13px",color:C.ink,fontSize:12,fontFamily:C.mono,cursor:"pointer"}}>
                <option value="">All Statuses</option>
                {["Submitted","Under Review","Resolved","Rejected"].map(s=><option key={s}>{s}</option>)}
              </select>
              <input placeholder="Search village, phone or Ticket ID…" value={gs} onChange={e=>setGs(e.target.value)}
                style={{flex:1,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"8px 13px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none"}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtG.map(g=>(
                <Card key={g.id} style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontWeight:600,fontSize:14}}>{g.name}</span>
                        <span style={{fontSize:10,fontFamily:C.mono,color:C.saffron,background:C.saffronL,padding:"2px 8px",borderRadius:6,fontWeight:500}}>{g.ticketId}</span>
                        <span style={{fontSize:11,fontFamily:C.mono,color:C.ink4}}>📍 {g.village} · {g.date}</span>
                      </div>
                      <div style={{fontSize:11,fontFamily:C.mono,color:C.blue,marginBottom:5}}>{g.category}</div>
                      <p style={{color:C.ink2,fontSize:13,margin:0,lineHeight:1.6,fontWeight:300}}>{g.description}</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,marginLeft:18}}>
                      <Badge status={g.status} dict={GT}/>
                      <select value={g.status} onChange={e=>setData(d=>({...d,grievances:d.grievances.map(x=>x.id===g.id?{...x,status:e.target.value}:x)}))}
                        style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"5px 9px",color:C.ink,fontSize:11,fontFamily:C.sans,cursor:"pointer"}}>
                        {["Submitted","Under Review","Resolved","Rejected"].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTRACTORS ── */}
        {tab==="contractors"&&<AdminContractors data={data} setData={setData}/>}

        {/* ── NOTIFICATIONS ── */}
        {tab==="notif"&&<AdminNotifications data={data}/>}

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ADMIN — CONTRACTOR MANAGEMENT
════════════════════════════════════════════════════════════════ */
function AdminContractors({data,setData}) {
  const [contractors,setContractors]=useState([]);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({name:"",email:"",phone:"",company:"",password_hash:""});
  const [assigning,setAssigning]=useState(null);
  const [assignments,setAssignments]=useState([]);
  const [msg,setMsg]=useState("");
  const [showAdd,setShowAdd]=useState(false);

  useEffect(()=>{loadContractors();},[]);

  const loadContractors=async()=>{
    setLoading(true);
    try {
      const [ctrs,asgn]=await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/contractors?select=*&order=created_at.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/project_assignments?select=*`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
      ]);
      setContractors(ctrs||[]);
      setAssignments(asgn||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };

  const addContractor=async()=>{
    if(!form.name||!form.email||!form.password_hash){setMsg("Naam, email aur password zaroori hai");return;}
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/contractors`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      setMsg("✅ Contractor add ho gaya!");
      setForm({name:"",email:"",phone:"",company:"",password_hash:""});
      setShowAdd(false);
      loadContractors();
    } catch(e){setMsg("Error aaya");} finally{setTimeout(()=>setMsg(""),3000);}
  };

  const toggleActive=async(c)=>{
    await fetch(`${SUPABASE_URL}/rest/v1/contractors?id=eq.${c.id}`,{
      method:"PATCH",
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({active:!c.active})
    });
    loadContractors();
  };

  const assignProject=async(contractorId,projectId)=>{
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/project_assignments`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({contractor_id:contractorId,project_id:parseInt(projectId)})
      });
      // Send notification to contractor
      await fetch(`${SUPABASE_URL}/rest/v1/notifications`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({title:"Naya Project Assign Hua!",message:`Aapko ek naya project assign kiya gaya hai. Dashboard mein dekho.`,type:"contractor",target:"contractor",contractor_id:contractorId,read:false})
      });
      setMsg("✅ Project assign ho gaya aur notification bhi bheji gayi!");
      loadContractors();
    } catch(e){setMsg("Error");} finally{setTimeout(()=>setMsg(""),3000);}
  };

  const removeAssignment=async(contractorId,projectId)=>{
    await fetch(`${SUPABASE_URL}/rest/v1/project_assignments?contractor_id=eq.${contractorId}&project_id=eq.${projectId}`,{
      method:"DELETE",
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}
    });
    loadContractors();
    setMsg("Assignment remove ho gayi");
    setTimeout(()=>setMsg(""),2000);
  };

  if(loading) return <div style={{padding:40,textAlign:"center",color:C.ink3}}>Loading contractors...</div>;

  return(
    <div className="fu">
      {msg&&<div style={{position:"fixed",top:20,right:20,background:msg.startsWith("✅")?C.greenL:C.redL,color:msg.startsWith("✅")?"#14532d":C.red,padding:"10px 18px",borderRadius:10,fontSize:13,fontFamily:C.mono,zIndex:9999}}>{msg}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20}}>
        <SectionTitle sub="Field workers aur contractors manage karo">Contractor Management</SectionTitle>
        <Btn onClick={()=>setShowAdd(s=>!s)}>+ Naya Contractor Add Karo</Btn>
      </div>

      {showAdd&&(
        <Card style={{padding:22,marginBottom:20,background:C.saffronL,border:`1px solid ${C.saffron}33`}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:C.ink}}>Naya Contractor / Worker</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="Naam *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Worker ka naam"/>
            <Field label="Email *" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="login email"/>
            <Field label="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="mobile number"/>
            <Field label="Company / Firm" value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="company naam"/>
            <Field label="Password *" value={form.password_hash} onChange={e=>setForm(f=>({...f,password_hash:e.target.value}))} placeholder="login password"/>
          </div>
          {msg&&!msg.startsWith("✅")&&<div style={{color:C.red,fontSize:12,marginTop:8}}>{msg}</div>}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <Btn onClick={addContractor}>✅ Save Karo</Btn>
            <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {contractors.length===0&&<Card style={{padding:24,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>👷</div><div style={{color:C.ink3}}>Koi contractor nahi abhi — upar se add karo</div></Card>}
        {contractors.map(c=>{
          const cAssignments=assignments.filter(a=>a.contractor_id===c.id);
          const assignedProjects=data.projects.filter(p=>cAssignments.find(a=>a.project_id===p.id));
          const unassignedProjects=data.projects.filter(p=>!cAssignments.find(a=>a.project_id===p.id));
          return(
            <Card key={c.id} style={{padding:20,opacity:c.active?1:0.6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:600,fontSize:15,color:C.ink}}>{c.name}</div>
                  <div style={{fontSize:12,color:C.ink3,marginTop:3}}>📧 {c.email} · 📞 {c.phone}</div>
                  {c.company&&<div style={{fontSize:12,color:C.ink4}}>🏢 {c.company}</div>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:11,fontFamily:C.mono,color:c.active?C.green:C.red,background:c.active?C.greenL:C.redL,padding:"3px 10px",borderRadius:99}}>{c.active?"Active":"Inactive"}</span>
                  <Btn sm variant={c.active?"danger":"secondary"} onClick={()=>toggleActive(c)}>{c.active?"Deactivate":"Activate"}</Btn>
                </div>
              </div>

              {/* Assigned Projects */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Assigned Projects ({assignedProjects.length})</div>
                {assignedProjects.length===0?<div style={{fontSize:12,color:C.ink4,fontStyle:"italic"}}>Koi project assign nahi hua</div>:(
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {assignedProjects.map(p=>(
                      <div key={p.id} style={{display:"flex",alignItems:"center",gap:6,background:C.greenL,borderRadius:8,padding:"4px 10px"}}>
                        <span style={{fontSize:12,color:"#14532d"}}>{p.scheme} — {p.village}</span>
                        <button onClick={()=>removeAssignment(c.id,p.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,lineHeight:1}}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assign New Project */}
              {unassignedProjects.length>0&&(
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <select defaultValue="" onChange={e=>{if(e.target.value)assignProject(c.id,e.target.value);e.target.value="";}}
                    style={{flex:1,padding:"7px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:C.sans,background:"#fff",outline:"none",color:C.ink}}>
                    <option value="">+ Project assign karo...</option>
                    {unassignedProjects.map(p=><option key={p.id} value={p.id}>{p.scheme} — {p.village}</option>)}
                  </select>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ADMIN — NOTIFICATION SENDER
════════════════════════════════════════════════════════════════ */
function AdminNotifications({data}) {
  const [contractors,setContractors]=useState([]);
  const [form,setForm]=useState({title:"",message:"",target:"all"});
  const [sentNotifs,setSentNotifs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(false);
  const [msg,setMsg]=useState("");
  const [selContractor,setSelContractor]=useState("");

  useEffect(()=>{loadAll();},[]);

  const loadAll=async()=>{
    try {
      const [ctrs,notifs]=await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/contractors?select=*&active=eq.true`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/notifications?select=*&order=created_at.desc&limit=30`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
      ]);
      setContractors(ctrs||[]);
      setSentNotifs(notifs||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };

  const sendNotification=async()=>{
    if(!form.title||!form.message){setMsg("Title aur message dono likho");return;}
    setSending(true);
    try {
      const payload={title:form.title,message:form.message,type:form.target==="all"?"public":"contractor",target:form.target,read:false};
      if(form.target==="contractor"&&selContractor) payload.contractor_id=parseInt(selContractor);

      await fetch(`${SUPABASE_URL}/rest/v1/notifications`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });

      // Browser push notification for public
      if((form.target==="all"||form.target==="public")&&"Notification" in window) {
        Notification.requestPermission().then(perm=>{
          if(perm==="granted") new Notification(`LokDrishti: ${form.title}`,{body:form.message,icon:"👁️"});
        });
      }

      setMsg("✅ Notification send ho gayi!");
      setForm({title:"",message:"",target:"all"});
      setSelContractor("");
      loadAll();
    } catch(e){setMsg("Error aaya");} finally{setSending(false);setTimeout(()=>setMsg(""),3000);}
  };

  return(
    <div className="fu">
      {msg&&<div style={{position:"fixed",top:20,right:20,background:msg.startsWith("✅")?C.greenL:C.redL,color:msg.startsWith("✅")?"#14532d":C.red,padding:"10px 18px",borderRadius:10,fontSize:13,fontFamily:C.mono,zIndex:9999}}>{msg}</div>}
      <SectionTitle sub="Public aur contractors ko notifications bhejo">Notification Center</SectionTitle>

      <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:20}}>
        {/* Send Form */}
        <Card style={{padding:24}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:C.ink}}>🔔 Naya Notification Bhejo</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Field label="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Naya kaam shuru ho gaya!"/>
            <Field label="Message *" rows={3} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Poora message likhiye..."/>
            <div>
              <Label>Kisko Bhejna Hai?</Label>
              <div style={{display:"flex",gap:8}}>
                {[["all","🌐 Sabko"],["public","👥 Public"],["contractor","👷 Contractor"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setForm(f=>({...f,target:v}))}
                    style={{flex:1,padding:"8px 6px",borderRadius:8,border:`1.5px solid ${form.target===v?C.saffron:C.border}`,background:form.target===v?C.saffronL:"#fff",fontSize:11,cursor:"pointer",fontFamily:C.sans,color:form.target===v?C.saffronD:C.ink3,fontWeight:form.target===v?600:400}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {form.target==="contractor"&&(
              <div>
                <Label>Specific Contractor</Label>
                <select value={selContractor} onChange={e=>setSelContractor(e.target.value)}
                  style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:C.sans,background:"#fff",outline:"none"}}>
                  <option value="">Sab contractors ko</option>
                  {contractors.map(c=><option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
                </select>
              </div>
            )}
            <Btn onClick={sendNotification} disabled={sending}>{sending?"Sending...":"📤 Send Karo"}</Btn>
          </div>
        </Card>

        {/* Recent Notifications */}
        <div>
          <div style={{fontSize:13,fontWeight:600,color:C.ink,marginBottom:12}}>Recent Notifications</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:500,overflowY:"auto"}}>
            {loading?<div style={{color:C.ink3,fontSize:12}}>Loading...</div>:sentNotifs.length===0?<div style={{color:C.ink3,fontSize:12}}>Koi notification nahi abhi</div>:
              sentNotifs.map(n=>(
                <Card key={n.id} style={{padding:14}}>
                  <div style={{fontWeight:600,fontSize:12,color:C.ink,marginBottom:4}}>{n.title}</div>
                  <div style={{fontSize:11,color:C.ink3,marginBottom:6}}>{n.message}</div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{fontSize:10,fontFamily:C.mono,color:C.ink4}}>{fmtD(n.created_at?.split("T")[0])}</span>
                    <span style={{fontSize:10,fontFamily:C.mono,background:n.target==="all"?C.blueL:C.saffronL,color:n.target==="all"?C.blue:C.saffronD,padding:"1px 6px",borderRadius:4}}>{n.target==="all"?"Sabko":n.target==="public"?"Public":"Contractor"}</span>
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Admin sub-forms ────────────────────────────────────────── */
function AdminProjForm({proj,onSave,onCancel}) {
  const [f,setF]=useState({...proj,milestones:proj.milestones||[]});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  const imgUp=(key,e)=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>s(key,ev.target.result);r.readAsDataURL(file);};
  const addMilestone=()=>setF(x=>({...x,milestones:[...x.milestones,{label:"",date:"",done:false}]}));
  const setMS=(i,k,v)=>setF(x=>({...x,milestones:x.milestones.map((m,idx)=>idx===i?{...m,[k]:v}:m)}));
  return(
    <Card>
      <div style={{padding:26}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          {[["Scheme Name","scheme"],["Category","category"],["Panchayat","panchayat"],["Village","village"]].map(([l,k])=>(
            <Field key={k} label={l} value={f[k]||""} onChange={e=>s(k,e.target.value)}/>
          ))}
          {[["Budget Allocated (₹)","budget","number"],["Budget Spent (₹)","spent","number"],["Beneficiary Count","beneficiaries","number"]].map(([l,k,t])=>(
            <Field key={k} label={l} value={f[k]||""} type={t} onChange={e=>s(k,e.target.value)}/>
          ))}
          <SelF label="Status" value={f.status||"Pending"} onChange={e=>s("status",e.target.value)} options={["Pending","Approved","Ongoing","Completed"]}/>
          <Field label="Start Date" value={f.start||""} type="date" onChange={e=>s("start",e.target.value)}/>
          <Field label="Completion Date" value={f.completion||""} type="date" onChange={e=>s("completion",e.target.value)}/>
        </div>
        {/* Milestones */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:10,letterSpacing:"0.07em",textTransform:"uppercase"}}>Project Milestones</div>
          {f.milestones.map((m,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr auto auto",gap:10,marginBottom:8,alignItems:"center"}}>
              <input value={m.label} onChange={e=>setMS(i,"label",e.target.value)} placeholder={`Milestone ${i+1}`}
                style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"7px 12px",color:C.ink,fontSize:12,fontFamily:C.sans,outline:"none"}}/>
              <input type="date" value={m.date} onChange={e=>setMS(i,"date",e.target.value)}
                style={{background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"7px 12px",color:C.ink,fontSize:12,fontFamily:C.sans,outline:"none"}}/>
              <label style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.ink2,cursor:"pointer",whiteSpace:"nowrap"}}>
                <input type="checkbox" checked={m.done} onChange={e=>setMS(i,"done",e.target.checked)} style={{accentColor:C.green}}/>Done
              </label>
              <button onClick={()=>setF(x=>({...x,milestones:x.milestones.filter((_,idx)=>idx!==i)}))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14}}>✕</button>
            </div>
          ))}
          <button onClick={addMilestone} style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.ink3,fontSize:12,fontFamily:C.mono,cursor:"pointer",marginTop:4}}>+ Add Milestone</button>
        </div>
        {/* Images */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[["Before Image","beforeImg"],["After Image","afterImg"]].map(([l,k])=>(
            <div key={k}>
              <Label>{l}</Label>
              <label style={{display:"block",height:100,background:"#fafaf8",border:`2px dashed ${C.border}`,borderRadius:10,cursor:"pointer",overflow:"hidden",position:"relative",transition:"border-color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.saffron} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                {f[k]?<img src={f[k]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={l}/>:
                  <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:C.mono,color:C.ink4,flexDirection:"column",gap:5}}><span style={{fontSize:22}}>📷</span>Upload {l}</span>}
                <input type="file" accept="image/*" onChange={e=>imgUp(k,e)} style={{display:"none"}}/>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 26px",borderTop:`1px solid ${C.border}`,background:"#fafaf8",display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={()=>onSave(f)}>Save Project</Btn>
      </div>
    </Card>
  );
}

function MeetingForm({meet,onSave,onCancel}) {
  const [f,setF]=useState({...meet,agenda:Array.isArray(meet.agenda)?meet.agenda:[""],decisions:Array.isArray(meet.decisions)?meet.decisions:[""]});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  const addItem=key=>setF(x=>({...x,[key]:[...x[key],""]}));
  const setItem=(key,i,v)=>setF(x=>({...x,[key]:x[key].map((it,idx)=>idx===i?v:it)}));
  return(
    <Card>
      <div style={{padding:26,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><Field label="Meeting Title" value={f.title} onChange={e=>s("title",e.target.value)}/></div>
          <Field label="Date" value={f.date} type="date" onChange={e=>s("date",e.target.value)}/>
          <SelF label="Type" value={f.type} onChange={e=>s("type",e.target.value)} options={["Gram Sabha","Special","Review","Emergency"]}/>
          <Field label="Venue" value={f.venue} onChange={e=>s("venue",e.target.value)}/>
          <SelF label="Status" value={f.status} onChange={e=>s("status",e.target.value)} options={["Upcoming","Completed"]}/>
          {f.status==="Completed"&&<><Field label="Attendance Count" value={f.attendance} type="number" onChange={e=>s("attendance",e.target.value)}/><Field label="Total Members" value={f.totalMembers} type="number" onChange={e=>s("totalMembers",e.target.value)}/></>}
        </div>
        <div>
          <Label>Agenda Items</Label>
          {f.agenda.map((item,i)=>(<div key={i} style={{marginBottom:8}}><input value={item} onChange={e=>setItem("agenda",i,e.target.value)} placeholder={`Agenda item ${i+1}`} style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none"}} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/></div>))}
          <button onClick={()=>addItem("agenda")} style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.ink3,fontSize:12,fontFamily:C.mono,cursor:"pointer"}}>+ Add Agenda Item</button>
        </div>
        {f.status==="Completed"&&(
          <div>
            <Label>Decisions Taken</Label>
            {f.decisions.map((item,i)=>(<div key={i} style={{marginBottom:8}}><input value={item} onChange={e=>setItem("decisions",i,e.target.value)} placeholder={`Decision ${i+1}`} style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none"}} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/></div>))}
            <button onClick={()=>addItem("decisions")} style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.ink3,fontSize:12,fontFamily:C.mono,cursor:"pointer"}}>+ Add Decision</button>
          </div>
        )}
        {f.status==="Completed"&&<Field label="Meeting Minutes" value={f.minutes} onChange={e=>s("minutes",e.target.value)} rows={3}/>}
      </div>
      <div style={{padding:"14px 26px",borderTop:`1px solid ${C.border}`,background:"#fafaf8",display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={()=>onSave(f)}>Save Meeting</Btn>
      </div>
    </Card>
  );
}

function AdminNoticeForm({onAdd}) {
  const [f,setF]=useState({title:"",category:"Scheme",content:"",important:false});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  return(
    <Card style={{padding:22,marginBottom:6}}>
      <div style={{fontSize:12,fontWeight:600,marginBottom:14,color:C.ink}}>📌 Post New Notice</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
        <Field label="Title" value={f.title} onChange={e=>s("title",e.target.value)}/>
        <SelF label="Category" value={f.category} onChange={e=>s("category",e.target.value)} options={["Scheme","Tender","Meeting","Alert","General"]}/>
      </div>
      <Field label="Content" value={f.content} onChange={e=>s("content",e.target.value)} rows={2}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:C.ink2,cursor:"pointer"}}>
          <input type="checkbox" checked={f.important} onChange={e=>s("important",e.target.checked)} style={{width:15,height:15,accentColor:C.red}}/>
          Mark as Important
        </label>
        <Btn onClick={()=>{if(!f.title||!f.content)return;onAdd(f);setF({title:"",category:"Scheme",content:"",important:false});}}>Post Notice</Btn>
      </div>
    </Card>
  );
}

function AdminPollForm({onAdd}) {
  const [q,setQ]=useState("");
  const [opts,setOpts]=useState(["",""]);
  const [ends,setEnds]=useState("");
  const addOpt=()=>setOpts(o=>[...o,""]);
  const setOpt=(i,v)=>setOpts(o=>o.map((x,idx)=>idx===i?v:x));
  return(
    <Card style={{padding:22,marginBottom:6}}>
      <div style={{fontSize:12,fontWeight:600,marginBottom:14,color:C.ink}}>🗳️ Create New Poll</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Field label="Poll Question" value={q} onChange={e=>setQ(e.target.value)} placeholder="Aapke hisaab se..."/>
        <div>
          <Label>Options (minimum 2)</Label>
          {opts.map((o,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
              <input value={o} onChange={e=>setOpt(i,e.target.value)} placeholder={`Option ${i+1}`}
                style={{flex:1,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none"}}
                onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
              {opts.length>2&&<button onClick={()=>setOpts(o=>o.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16}}>✕</button>}
            </div>
          ))}
          <button onClick={addOpt} style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.ink3,fontSize:12,fontFamily:C.mono,cursor:"pointer"}}>+ Add Option</button>
        </div>
        <Field label="Ends On" value={ends} type="date" onChange={e=>setEnds(e.target.value)}/>
        <Btn onClick={()=>{
          if(!q||opts.filter(o=>o.trim()).length<2)return;
          onAdd({question:q,options:opts.filter(o=>o.trim()),endsOn:ends,active:true});
          setQ("");setOpts(["",""]);setEnds("");
        }}>Launch Poll</Btn>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   PUBLIC WEBSITE
════════════════════════════════════════════════════════════════ */
function Public({data,setData}) {
  const [page,setPage]     = useState("home");
  const [selProj,setSP]    = useState(null);
  const [selMeet,setSM]    = useState(null);
  const [activeTab,setAT]  = useState("timeline"); // project detail sub-tabs
  const [filters,setFilters] = useState({panchayat:"",village:"",status:"",year:"",scheme:""});
  const [gTab,setGTab]     = useState("raise");
  const [gf,setGf]         = useState({name:"",mobile:"",email:"",village:"",category:"Road Repair",description:"",image:null});
  const [trackQ,setTrackQ] = useState("");
  const [trackRes,setTrackRes] = useState(null);
  const [otpSent,setOtpSent] = useState(false);
  const [otp,setOtp]       = useState("");
  const [otpOk,setOtpOk]   = useState(false);
  const [subTicket,setSub] = useState(null);
  const [mobErr,setMobErr] = useState("");
  const [schemeIncome,setSI] = useState("");
  const [schemeCat,setSC]  = useState("General");
  const [schemeLand,setSL] = useState("no");
  const [schemeResult,setSR] = useState(null);
  // Review form state
  const [reviewProjId,setRP] = useState(null);
  const [revForm,setRevForm] = useState({name:"",village:"",stars:0,comment:""});
  const [revDone,setRevDone] = useState(false);
  // Hover star
  const [hoverStar,setHS]  = useState(0);
  // Poll voted
  const [voted,setVoted]   = useState({});

  const stats = useMemo(()=>{
    const p=data.projects;
    return{comp:p.filter(x=>x.status==="Completed").length,budget:p.reduce((a,x)=>a+x.budget,0),
      spent:p.reduce((a,x)=>a+x.spent,0),villages:new Set(p.map(x=>x.village)).size,benef:p.reduce((a,x)=>a+x.beneficiaries,0)};
  },[data.projects]);

  const fp=data.projects.filter(p=>(
    (!filters.panchayat||p.panchayat===filters.panchayat)&&
    (!filters.village||p.village.toLowerCase().includes(filters.village.toLowerCase()))&&
    (!filters.status||p.status===filters.status)&&
    (!filters.year||(p.start&&p.start.startsWith(filters.year)))&&
    (!filters.scheme||p.scheme.toLowerCase().includes(filters.scheme.toLowerCase()))
  ));
  const panchayats=[...new Set(data.projects.map(p=>p.panchayat))];
  const years=[...new Set(data.projects.filter(p=>p.start).map(p=>p.start.slice(0,4)))].sort().reverse();

  const sendOtp=()=>{if(!/^[0-9]{10}$/.test(gf.mobile)){setMobErr("Valid 10-digit number required");return;}setMobErr("");setOtpSent(true);};
  const verOtp=()=>{if(otp.length===4)setOtpOk(true);else alert("Enter any 4 digits (demo)");};
  const submit=()=>{
    const tid=genTID();
    setData(d=>({...d,grievances:[{id:Date.now(),ticketId:tid,name:gf.name,mobile:"***"+gf.mobile.slice(-4),email:gf.email,village:gf.village,category:gf.category,description:gf.description,image:gf.image,status:"Submitted",date:new Date().toISOString().split("T")[0]},...d.grievances]}));
    setSub(tid);
  };
  const track=()=>{
    const q=trackQ.trim().toLowerCase();
    setTrackRes(data.grievances.filter(g=>g.ticketId?.toLowerCase()===q||g.mobile.endsWith(q.slice(-4))));
  };

  // Submit a review for a project
  const submitReview=()=>{
    if(!revForm.name||!revForm.village||!revForm.stars||!revForm.comment)return;
    const newRev={id:Date.now(),name:revForm.name,village:revForm.village,stars:revForm.stars,comment:revForm.comment,date:new Date().toISOString().split("T")[0]};
    setData(d=>({...d,projects:d.projects.map(p=>{
      if(p.id!==reviewProjId)return p;
      const newRevs=[...p.reviews,newRev];
      const newRating=newRevs.reduce((a,r)=>a+r.stars,0)/newRevs.length;
      return{...p,reviews:newRevs,rating:Math.round(newRating*10)/10,ratings:newRevs.length};
    })}));
    // update selProj in place
    setSP(prev=>{
      if(!prev||prev.id!==reviewProjId)return prev;
      const newRevs=[...prev.reviews,newRev];
      return{...prev,reviews:newRevs,rating:Math.round(newRevs.reduce((a,r)=>a+r.stars,0)/newRevs.length*10)/10,ratings:newRevs.length};
    });
    setRevDone(true);
  };

  // Cast a poll vote
  const castVote=(pollId,optIdx)=>{
    if(voted[pollId])return;
    setData(d=>({...d,polls:d.polls.map(p=>{
      if(p.id!==pollId)return p;
      const newVotes=[...p.votes];newVotes[optIdx]+=1;
      return{...p,votes:newVotes,totalVoters:(p.totalVoters||0)+1};
    })}));
    setVoted(v=>({...v,[pollId]:optIdx}));
  };

  const checkEligibility=()=>{
    const inc=parseFloat(schemeIncome)||0;const land=schemeLand==="yes";
    setSR(SCHEMES_ELIGIBILITY.filter(s=>{
      const c=s.criteria;return inc<=c.maxIncome&&c.category.includes(schemeCat)&&(c.landOwner===null||(c.landOwner===true&&land)||(c.landOwner===false&&!land));
    }));
  };

  const NAV=[["home","Home"],["works","Works"],["meetings","Meetings"],["notices","Notices"],["polls","Polls"],["analytics","Analytics"],["schemes","Schemes"],["grievance","Grievance"]];
  const important=data.notices.filter(n=>n.important);

  const navTo=(p)=>{setPage(p);setSP(null);setSM(null);setMobOpen(false);};
  const [mobOpen,setMobOpen]=useState(false);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.sans,color:C.ink}}>
      {/* Ticker */}
      {important.length>0&&(
        <div style={{background:`linear-gradient(90deg,${C.saffron},${C.saffronD})`,padding:"7px 16px",display:"flex",alignItems:"center",gap:12,overflow:"hidden"}}>
          <span style={{fontSize:10,fontFamily:C.mono,color:"rgba(255,255,255,0.8)",background:"rgba(0,0,0,0.15)",padding:"2px 8px",borderRadius:4,letterSpacing:"0.06em",flexShrink:0}}>NOTICE</span>
          <span style={{fontSize:12,color:"#fff",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{important[0].title} — {important[0].content.slice(0,80)}…</span>
        </div>
      )}

      {/* Header */}
      <header style={{background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 0 rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${C.saffron},${C.saffronD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>👁️</div>
            <div>
              <div style={{fontFamily:C.serif,fontSize:18,fontWeight:700,letterSpacing:"-0.01em",lineHeight:1,color:C.ink}}>LokDrishti</div>
              <div style={{fontSize:9,color:C.ink4,fontFamily:C.mono,letterSpacing:"0.08em",textTransform:"uppercase"}}>Panchayat Transparency Portal</div>
            </div>
          </div>
          {/* Desktop Nav */}
          <nav className="nav-desktop">
            {NAV.map(([id,l])=>(
              <button key={id} onClick={()=>navTo(id)}
                style={{padding:"6px 12px",background:page===id?`${C.saffron}16`:"transparent",border:"none",borderRadius:8,color:page===id?C.saffronD:C.ink3,fontFamily:C.sans,fontSize:12,cursor:"pointer",fontWeight:page===id?600:400,transition:"all .15s"}}>
                {l}
              </button>
            ))}
          </nav>
          {/* Mobile Hamburger */}
          <button className="nav-mobile-btn" onClick={()=>setMobOpen(o=>!o)}
            style={{flexDirection:"column",gap:5,padding:"8px"}}>
            <div style={{width:22,height:2,background:mobOpen?C.saffron:C.ink,borderRadius:2,transition:"all .2s",transform:mobOpen?"rotate(45deg) translate(5px,5px)":"none"}}/>
            <div style={{width:22,height:2,background:mobOpen?C.saffron:C.ink,borderRadius:2,transition:"all .2s",opacity:mobOpen?0:1}}/>
            <div style={{width:22,height:2,background:mobOpen?C.saffron:C.ink,borderRadius:2,transition:"all .2s",transform:mobOpen?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
          </button>
        </div>
        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu${mobOpen?" open":""}`}>
          {NAV.map(([id,l])=>(
            <button key={id} onClick={()=>navTo(id)}
              style={{fontWeight:page===id?600:400,color:page===id?C.saffronD:C.ink,background:page===id?C.saffronL:"none"}}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <main className="main-pad" style={{maxWidth:1140,margin:"0 auto"}}>

        {/* ────────── HOME ────────── */}
        {page==="home"&&(
          <div className="fu">
            {/* Hero */}
            <div className="hero-flex" style={{margin:"20px 0 20px",background:`linear-gradient(130deg,${C.ink} 0%,#32292a 100%)`,borderRadius:16,padding:"28px 28px",display:"flex",gap:26,alignItems:"center",boxShadow:"0 8px 36px rgba(0,0,0,0.14)"}}>
              <div style={{width:86,height:86,borderRadius:"50%",background:"#3a332e",border:`3px solid ${C.saffron}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {data.leader.photo?<img src={data.leader.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:34,color:"#555"}}>👤</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.saffron,marginBottom:6,letterSpacing:"0.1em",textTransform:"uppercase"}}>{data.leader.designation}</div>
                <h1 style={{fontFamily:C.serif,fontSize:30,fontWeight:700,margin:"0 0 5px",color:"#fff",letterSpacing:"-0.02em"}}>{data.leader.name}</h1>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.42)",fontFamily:C.mono,marginBottom:10}}>📍 {data.leader.constituency} &nbsp;·&nbsp; 🗓 {data.leader.term}</div>
                <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,margin:"0 0 10px",maxWidth:520,lineHeight:1.75,fontWeight:300}}>{data.leader.bio}</p>
                <div style={{display:"flex",gap:12}}>
                  {data.leader.phone&&<span style={{fontSize:11,fontFamily:C.mono,color:"rgba(255,255,255,0.35)"}}>📞 {data.leader.phone}</span>}
                  {data.leader.email&&<span style={{fontSize:11,fontFamily:C.mono,color:"rgba(255,255,255,0.35)"}}>✉️ {data.leader.email}</span>}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{marginBottom:24}}>
              <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:14,letterSpacing:"0.08em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block",animation:"blink 2s infinite"}}/>
                Live Statistics — Auto-calculated
              </div>
              <div className="stats-row" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
                {[{l:"Projects\nCompleted",v:stats.comp,ic:"✅",c:C.green},{l:"Budget\nAllocated",v:fmtC(stats.budget),ic:"💰",c:C.saffron},
                  {l:"Budget\nUtilized",v:fmtC(stats.spent),ic:"📊",c:C.purple},{l:"Villages\nCovered",v:stats.villages,ic:"🏘️",c:C.blue},
                  {l:"Total\nBeneficiaries",v:fmt(stats.benef),ic:"👥",c:C.green}].map(({l,v,ic,c})=>(
                  <Card key={l} style={{padding:"18px 14px",textAlign:"center"}}>
                    <div style={{fontSize:22,marginBottom:8}}>{ic}</div>
                    <div style={{fontFamily:C.serif,fontSize:21,fontWeight:700,color:c,marginBottom:5,lineHeight:1}}>{v}</div>
                    <div style={{fontSize:10,color:C.ink3,lineHeight:1.5,whiteSpace:"pre-line"}}>{l}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick cards grid */}
            <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:20}}>
              <Card>
                <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.border2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:12,fontWeight:600}}>🏗 Recent Projects</div>
                  <button onClick={()=>navTo("works")} style={{background:"none",border:"none",color:C.saffron,fontSize:12,cursor:"pointer",fontFamily:C.sans,fontWeight:500}}>View all →</button>
                </div>
                {data.projects.slice(0,5).map((p,i)=>(
                  <div key={p.id}>
                    {i>0&&<Div/>}
                    <div onClick={()=>{setSP(p);setAT("timeline");setPage("works");}} className="row-hover"
                      style={{padding:"13px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"background .1s"}}>
                      <div style={{width:34,height:34,borderRadius:8,background:`${C.saffron}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{CATS_ICONS[p.category]||"🔧"}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:500,fontSize:13,marginBottom:2}}>{p.scheme}</div>
                        <div style={{fontSize:11,color:C.ink3}}>{p.village}, {p.panchayat}</div>
                      </div>
                      <Badge status={p.status} dict={ST}/>
                    </div>
                  </div>
                ))}
              </Card>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {/* Active poll preview */}
                {(data.polls||[]).filter(p=>p.active).slice(0,1).map(poll=>(
                  <Card key={poll.id} style={{padding:18}}>
                    <div style={{fontSize:11,fontFamily:C.mono,color:C.teal,background:C.tealL,padding:"2px 9px",borderRadius:6,display:"inline-block",marginBottom:10,fontWeight:500}}>🗳️ ACTIVE POLL</div>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:12,lineHeight:1.5}}>{poll.question}</div>
                    {poll.options.slice(0,3).map((opt,i)=>(
                      <button key={i} onClick={()=>castVote(poll.id,i)} disabled={!!voted[poll.id]}
                        style={{width:"100%",textAlign:"left",marginBottom:6,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${voted[poll.id]===i?C.teal:C.border}`,
                          background:voted[poll.id]===i?C.tealL:"#fff",color:C.ink,fontSize:12,cursor:voted[poll.id]?"default":"pointer",fontFamily:C.sans,transition:"all .15s"}}>
                        {opt}
                      </button>
                    ))}
                    <button onClick={()=>navTo("polls")} style={{background:"none",border:"none",color:C.saffron,fontSize:12,fontFamily:C.sans,cursor:"pointer",marginTop:4,fontWeight:500,padding:0}}>View full poll →</button>
                  </Card>
                ))}
                <Card style={{flex:1}}>
                  <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${C.border2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:12,fontWeight:600}}>📢 Latest Notices</div>
                    <button onClick={()=>navTo("notices")} style={{background:"none",border:"none",color:C.saffron,fontSize:11,cursor:"pointer",fontFamily:C.sans}}>All →</button>
                  </div>
                  {data.notices.slice(0,3).map((n,i)=>(
                    <div key={n.id}>
                      {i>0&&<Div/>}
                      <div style={{padding:"10px 18px"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                          {n.important&&<span style={{width:6,height:6,borderRadius:"50%",background:C.red,flexShrink:0}}/>}
                          <span style={{fontSize:11,fontFamily:C.mono,color:C.blue}}>{n.category}</span>
                          <span style={{fontSize:10,fontFamily:C.mono,color:C.ink4}}>{n.date}</span>
                        </div>
                        <div style={{fontSize:12,fontWeight:500}}>{n.title}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ────────── WORKS ────────── */}
        {page==="works"&&!selProj&&(
          <div className="fu" style={{paddingTop:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}>
              <SectionTitle sub={`${fp.length} of ${data.projects.length} projects`}>Development Works</SectionTitle>
            </div>
            <Card style={{padding:16,marginBottom:18}}>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {[{k:"scheme",ph:"🔍 Search scheme…"},{k:"village",ph:"📍 Village…"}].map(({k,ph})=>(
                  <input key={k} placeholder={ph} value={filters[k]} onChange={e=>setFilters(f=>({...f,[k]:e.target.value}))}
                    style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.ink,fontSize:12,fontFamily:C.sans,outline:"none",width:158}}
                    onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
                ))}
                {[{k:"panchayat",opts:[{v:"",l:"All Panchayats"},...panchayats.map(p=>({v:p,l:p}))]},{k:"status",opts:[{v:"",l:"All Statuses"},...Object.keys(ST).map(s=>({v:s,l:s}))]},{k:"year",opts:[{v:"",l:"All Years"},...years.map(y=>({v:y,l:y}))]}].map(({k,opts})=>(
                  <select key={k} value={filters[k]} onChange={e=>setFilters(f=>({...f,[k]:e.target.value}))}
                    style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.ink,fontSize:12,fontFamily:C.sans,cursor:"pointer"}}>
                    {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                ))}
                {Object.values(filters).some(Boolean)&&(
                  <button onClick={()=>setFilters({panchayat:"",village:"",status:"",year:"",scheme:""})}
                    style={{background:C.redL,border:"none",borderRadius:8,padding:"8px 14px",color:C.red,fontSize:11,fontFamily:C.sans,cursor:"pointer",fontWeight:500}}>✕ Clear</button>
                )}
              </div>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
              {fp.map(p=>(
                <Card key={p.id} className="card-hover"
                  style={{cursor:"pointer",padding:0}}
                  onClick={()=>{setSP(p);setAT("timeline");setRevDone(false);setRevForm({name:"",village:"",stars:0,comment:""});setRP(p.id);}}>
                  <div style={{padding:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <span style={{fontSize:10,fontFamily:C.mono,color:C.saffron,background:C.saffronL,padding:"3px 9px",borderRadius:6,fontWeight:500}}>{CATS_ICONS[p.category]||"🔧"} {p.category}</span>
                      <Badge status={p.status} dict={ST}/>
                    </div>
                    <h3 style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>{p.scheme}</h3>
                    <p style={{fontSize:11,color:C.ink3,margin:"0 0 8px"}}>📍 {p.village}, {p.panchayat}</p>
                    <Stars val={p.rating||0} count={p.ratings||0}/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,margin:"12px 0"}}>
                      {[["Allocated",fmtC(p.budget)],["Utilized",fmtC(p.spent)],["Benef.",fmt(p.beneficiaries)]].map(([l,v])=>(
                        <div key={l} style={{background:C.bg,borderRadius:8,padding:"7px 10px"}}>
                          <div style={{fontSize:9,color:C.ink4,fontFamily:C.mono,marginBottom:2}}>{l}</div>
                          <div style={{fontSize:12,fontWeight:600,fontFamily:C.mono,color:C.ink}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <ProgressBar value={p.spent} max={p.budget} color={ST[p.status]?.dot||C.saffron}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                      <span style={{fontSize:9,fontFamily:C.mono,color:C.ink4}}>Budget utilized</span>
                      <span style={{fontSize:9,fontFamily:C.mono,color:C.ink3}}>{p.budget>0?Math.round(p.spent/p.budget*100):0}%</span>
                    </div>
                    {/* Milestone quick progress */}
                    {p.milestones?.length>0&&(
                      <div style={{marginTop:10,padding:"8px 12px",background:C.bg,borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,fontFamily:C.mono,color:C.ink3}}>Milestones:</span>
                        <div style={{flex:1,display:"flex",gap:3}}>
                          {p.milestones.map((m,i)=>(
                            <div key={i} style={{height:4,flex:1,borderRadius:99,background:m.done?C.green:C.border2,transition:"background .3s"}}/>
                          ))}
                        </div>
                        <span style={{fontSize:10,fontFamily:C.mono,color:C.green,fontWeight:600}}>{p.milestones.filter(m=>m.done).length}/{p.milestones.length}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ────────── PROJECT DETAIL ────────── */}
        {page==="works"&&selProj&&(
          <div className="fu" style={{paddingTop:28,maxWidth:820}}>
            <button onClick={()=>setSP(null)} style={{background:"none",border:"none",color:C.saffron,fontFamily:C.sans,fontSize:13,cursor:"pointer",marginBottom:18,padding:0,fontWeight:500}}>← Back to Projects</button>
            <Card>
              {/* Header */}
              <div style={{padding:"24px 26px 18px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <span style={{fontSize:11,fontFamily:C.mono,color:C.saffron,background:C.saffronL,padding:"3px 10px",borderRadius:6,fontWeight:500,display:"inline-block",marginBottom:10}}>{CATS_ICONS[selProj.category]} {selProj.category}</span>
                    <h2 style={{fontFamily:C.serif,fontSize:24,fontWeight:700,margin:"0 0 6px",letterSpacing:"-0.02em"}}>{selProj.scheme}</h2>
                    <div style={{fontSize:12,color:C.ink3,fontFamily:C.mono}}>📍 {selProj.village}, {selProj.panchayat} Panchayat</div>
                    <div style={{marginTop:8}}><Stars val={selProj.rating||0} count={selProj.ratings||0} size={16}/></div>
                  </div>
                  <Badge status={selProj.status} dict={ST} size="lg"/>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.border}}>
                {[["Budget Allocated",fmtC(selProj.budget),C.saffron],["Budget Utilized",fmtC(selProj.spent),C.green],["Beneficiaries",fmt(selProj.beneficiaries),C.blue],
                  ["Start Date",fmtD(selProj.start),C.ink],["Completion",fmtD(selProj.completion),C.ink],["Utilization",`${selProj.budget>0?Math.round(selProj.spent/selProj.budget*100):0}%`,C.saffron]
                ].map(([l,v,cl])=>(
                  <div key={l} style={{background:C.card,padding:"14px 18px"}}>
                    <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>{l}</div>
                    <div style={{fontFamily:C.serif,fontSize:19,fontWeight:700,color:cl}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"14px 20px 0"}}><ProgressBar value={selProj.spent} max={selProj.budget} color={C.saffron} h={7}/></div>

              {/* Sub-tabs: Timeline | Feedback | Photos */}
              <div style={{display:"flex",gap:0,padding:"16px 20px 0",borderBottom:`1px solid ${C.border2}`}}>
                {[["timeline","📅 Timeline"],["feedback","⭐ Reviews"],["photos","📷 Photos"]].map(([id,l])=>(
                  <button key={id} onClick={()=>setAT(id)}
                    style={{padding:"8px 18px",background:"none",border:"none",borderBottom:activeTab===id?`2px solid ${C.saffron}`:"2px solid transparent",
                      color:activeTab===id?C.saffron:C.ink3,fontFamily:C.sans,fontSize:13,cursor:"pointer",fontWeight:activeTab===id?600:400,transition:"all .15s",marginBottom:-1}}>
                    {l}
                  </button>
                ))}
              </div>

              {/* TIMELINE TAB */}
              {activeTab==="timeline"&&(
                <div style={{padding:24}}>
                  {selProj.milestones?.length>0
                    ?<Timeline milestones={selProj.milestones}/>
                    :<div style={{textAlign:"center",padding:"24px",color:C.ink4,fontFamily:C.mono,fontSize:12}}>No milestones added yet for this project.</div>}
                </div>
              )}

              {/* FEEDBACK TAB */}
              {activeTab==="feedback"&&(
                <div style={{padding:24}}>
                  {/* Rating summary */}
                  {selProj.ratings>0&&(
                    <div style={{display:"flex",gap:24,alignItems:"center",padding:"18px 20px",background:C.bg,borderRadius:12,marginBottom:22,border:`1px solid ${C.border}`}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:C.serif,fontSize:48,fontWeight:700,color:C.amber,lineHeight:1}}>{(selProj.rating||0).toFixed(1)}</div>
                        <Stars val={selProj.rating||0} count={0} size={18}/>
                        <div style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginTop:4}}>{selProj.ratings} ratings</div>
                      </div>
                      <div style={{flex:1}}>
                        {[5,4,3,2,1].map(star=>{
                          const c=(selProj.reviews||[]).filter(r=>r.stars===star).length;
                          const pct=selProj.ratings>0?Math.round(c/selProj.ratings*100):0;
                          return(
                            <div key={star} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                              <span style={{fontSize:11,fontFamily:C.mono,color:C.ink3,width:14,textAlign:"right"}}>{star}</span>
                              <span style={{color:C.amber,fontSize:11}}>★</span>
                              <div style={{flex:1,background:C.border2,borderRadius:99,height:6,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${pct}%`,background:C.amber,borderRadius:99,transition:"width .6s"}}/>
                              </div>
                              <span style={{fontSize:10,fontFamily:C.mono,color:C.ink4,width:24}}>{c}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Reviews list */}
                  {(selProj.reviews||[]).length>0&&(
                    <div style={{marginBottom:24}}>
                      <div style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginBottom:14,letterSpacing:"0.06em",textTransform:"uppercase"}}>Citizen Reviews</div>
                      <div style={{display:"flex",flexDirection:"column",gap:12}}>
                        {(selProj.reviews||[]).map(r=>(
                          <div key={r.id} style={{padding:"14px 16px",background:C.bg,borderRadius:12,border:`1px solid ${C.border}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                              <div>
                                <span style={{fontWeight:600,fontSize:13,marginRight:8}}>{r.name}</span>
                                <span style={{fontSize:11,fontFamily:C.mono,color:C.ink3}}>📍 {r.village}</span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <Stars val={r.stars} count={0} size={13}/>
                                <span style={{fontSize:10,fontFamily:C.mono,color:C.ink4}}>{r.date}</span>
                              </div>
                            </div>
                            <p style={{fontSize:13,color:C.ink2,margin:0,lineHeight:1.65,fontWeight:300,fontStyle:"italic"}}>"{r.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Write a review */}
                  <div style={{borderTop:`1px solid ${C.border2}`,paddingTop:20}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:14,color:C.ink}}>✍️ Write Your Review</div>
                    {revDone?(
                      <div style={{textAlign:"center",padding:"24px",background:C.greenL,borderRadius:12,border:`1px solid #86efac`}}>
                        <div style={{fontSize:22,marginBottom:8}}>🎉</div>
                        <div style={{fontWeight:600,color:"#14532d",fontSize:14}}>Thank you for your feedback!</div>
                        <div style={{fontSize:12,color:"#166534",marginTop:4}}>Your review helps improve governance accountability.</div>
                      </div>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:14}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                          <Field label="Your Name" value={revForm.name} onChange={e=>setRevForm(f=>({...f,name:e.target.value}))}/>
                          <Field label="Village" value={revForm.village} onChange={e=>setRevForm(f=>({...f,village:e.target.value}))}/>
                        </div>
                        <div>
                          <Label>Your Rating</Label>
                          <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            {[1,2,3,4,5].map(star=>(
                              <button key={star}
                                onMouseEnter={()=>setHS(star)} onMouseLeave={()=>setHS(0)}
                                onClick={()=>setRevForm(f=>({...f,stars:star}))}
                                style={{fontSize:30,background:"none",border:"none",cursor:"pointer",transition:"transform .1s",
                                  transform:hoverStar>=star||revForm.stars>=star?"scale(1.2)":"scale(1)",
                                  color:hoverStar>=star?C.amber:revForm.stars>=star?C.amber:"#ddd"}}>★</button>
                            ))}
                            {(revForm.stars>0||hoverStar>0)&&(
                              <span style={{fontSize:13,fontFamily:C.mono,color:C.ink3,marginLeft:4}}>
                                {["","Very Bad","Bad","Average","Good","Excellent"][hoverStar||revForm.stars]}
                              </span>
                            )}
                          </div>
                        </div>
                        <Field label="Comment" value={revForm.comment} onChange={e=>setRevForm(f=>({...f,comment:e.target.value}))} rows={3} placeholder="Share your experience about this project..."/>
                        <Btn onClick={submitReview} disabled={!revForm.name||!revForm.village||!revForm.stars||!revForm.comment}>Submit Review</Btn>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PHOTOS TAB */}
              {activeTab==="photos"&&(
                <div style={{padding:"16px 24px 24px"}}>
                  {(selProj.beforeImg||selProj.afterImg)?(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      {[["Before",selProj.beforeImg],["After",selProj.afterImg]].map(([l,src])=>(
                        <div key={l}>
                          <Label>{l} Image</Label>
                          <div style={{height:200,background:C.bg,borderRadius:10,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.border}`}}>
                            {src?<img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={l}/>:<span style={{fontSize:12,color:C.ink4,fontFamily:C.mono}}>No image uploaded</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ):(
                    <div style={{textAlign:"center",padding:"32px",color:C.ink4,fontFamily:C.mono,fontSize:12}}>No photos uploaded for this project yet.</div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ────────── MEETINGS ────────── */}
        {page==="meetings"&&!selMeet&&(
          <div className="fu" style={{paddingTop:28}}>
            <SectionTitle sub="Gram Sabha minutes, agendas and decisions">Meeting Records</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
              {data.meetings.map(m=>(
                <Card key={m.id} className="card-hover" style={{padding:20,cursor:"pointer"}} onClick={()=>setSM(m)}>
                  <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontSize:10,fontFamily:C.mono,color:C.saffron,background:C.saffronL,padding:"2px 9px",borderRadius:6}}>{m.type}</span>
                    <Badge status={m.status} dict={{Completed:{bg:C.greenL,tx:"#14532d",dot:C.green},Upcoming:{bg:C.blueL,tx:"#1e3a8a",dot:C.blue}}}/>
                  </div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:4,fontFamily:C.serif}}>{m.title}</div>
                  <div style={{fontSize:12,fontFamily:C.mono,color:C.saffron,marginBottom:6}}>📅 {fmtD(m.date)}</div>
                  <div style={{fontSize:12,color:C.ink3,marginBottom:10}}>📍 {m.venue}</div>
                  <div style={{fontSize:11,color:C.ink3}}>
                    <span style={{fontWeight:500}}>{m.agenda?.filter(a=>a).length||0}</span> agenda items ·{" "}
                    {m.status==="Completed"&&<><span style={{fontWeight:500}}>{m.decisions?.filter(d=>d).length||0}</span> decisions</>}
                    {m.status==="Upcoming"&&<span style={{color:C.blue}}>Open attendance</span>}
                  </div>
                  {m.status==="Completed"&&m.totalMembers>0&&(
                    <div style={{marginTop:10}}><ProgressBar value={m.attendance} max={m.totalMembers} color={C.green} h={4}/><div style={{fontSize:10,fontFamily:C.mono,color:C.ink4,marginTop:4}}>Attendance: {m.attendance}/{m.totalMembers}</div></div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
        {page==="meetings"&&selMeet&&(
          <div className="fu" style={{paddingTop:28,maxWidth:720}}>
            <button onClick={()=>setSM(null)} style={{background:"none",border:"none",color:C.saffron,fontFamily:C.sans,fontSize:13,cursor:"pointer",marginBottom:18,padding:0,fontWeight:500}}>← Back</button>
            <Card>
              <div style={{padding:"24px 26px 18px",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:11,fontFamily:C.mono,color:C.saffron,background:C.saffronL,padding:"3px 10px",borderRadius:6}}>{selMeet.type}</span>
                  <Badge status={selMeet.status} dict={{Completed:{bg:C.greenL,tx:"#14532d",dot:C.green},Upcoming:{bg:C.blueL,tx:"#1e3a8a",dot:C.blue}}}/>
                </div>
                <h2 style={{fontFamily:C.serif,fontSize:23,fontWeight:700,margin:"0 0 8px",letterSpacing:"-0.02em"}}>{selMeet.title}</h2>
                <div style={{display:"flex",gap:20,fontSize:12,color:C.ink3,fontFamily:C.mono}}>
                  <span>📅 {fmtD(selMeet.date)}</span><span>📍 {selMeet.venue}</span>
                  {selMeet.status==="Completed"&&<span>👥 {selMeet.attendance}/{selMeet.totalMembers} attended</span>}
                </div>
              </div>
              <div style={{padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <div>
                  <div style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginBottom:12,letterSpacing:"0.06em",textTransform:"uppercase"}}>Agenda</div>
                  {(selMeet.agenda||[]).filter(a=>a).map((a,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                      <span style={{width:20,height:20,borderRadius:"50%",background:C.saffronL,color:C.saffron,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:C.mono,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</span>
                      <span style={{fontSize:13,color:C.ink2,lineHeight:1.6}}>{a}</span>
                    </div>
                  ))}
                </div>
                {selMeet.status==="Completed"&&(
                  <div>
                    <div style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginBottom:12,letterSpacing:"0.06em",textTransform:"uppercase"}}>Decisions Taken</div>
                    {(selMeet.decisions||[]).filter(d=>d).map((d,i)=>(
                      <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                        <span style={{fontSize:12,color:C.green,flexShrink:0,marginTop:2}}>✓</span>
                        <span style={{fontSize:13,color:C.ink2,lineHeight:1.6}}>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selMeet.minutes&&<div style={{padding:"0 24px 24px"}}><div style={{fontSize:11,fontFamily:C.mono,color:C.ink3,marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>Minutes</div><div style={{background:C.bg,borderRadius:10,padding:"14px 16px",fontSize:13,color:C.ink2,lineHeight:1.7,border:`1px solid ${C.border2}`}}>{selMeet.minutes}</div></div>}
            </Card>
          </div>
        )}

        {/* ────────── NOTICES ────────── */}
        {page==="notices"&&(
          <div className="fu" style={{paddingTop:28}}>
            <SectionTitle sub="Official announcements, tenders and scheme updates">Notice Board</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {data.notices.map(n=>(
                <Card key={n.id} style={{padding:20}}>
                  <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
                    {n.important&&<span style={{fontSize:10,background:C.redL,color:C.red,padding:"2px 9px",borderRadius:6,fontFamily:C.mono,fontWeight:600}}>🔴 IMPORTANT</span>}
                    <span style={{fontSize:10,background:C.blueL,color:C.blue,padding:"2px 9px",borderRadius:6,fontFamily:C.mono}}>{n.category}</span>
                    <span style={{fontSize:11,fontFamily:C.mono,color:C.ink4}}>📅 {n.date}</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:6,fontFamily:C.serif}}>{n.title}</div>
                  <div style={{fontSize:13,color:C.ink2,lineHeight:1.7,fontWeight:300}}>{n.content}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ────────── POLLS (PUBLIC) ────────── */}
        {page==="polls"&&(
          <div className="fu" style={{paddingTop:28,maxWidth:680}}>
            <SectionTitle sub="Share your opinion — help prioritize development">Citizen Polls</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              {(data.polls||[]).map(poll=>{
                const total=poll.votes.reduce((a,v)=>a+v,0)||1;
                const maxV=Math.max(...poll.votes);
                const hasVoted=!!voted[poll.id];
                const showResults=hasVoted||!poll.active;
                const COLORS=[C.saffron,C.blue,C.green,C.purple,C.teal];
                return(
                  <Card key={poll.id} style={{padding:24}}>
                    <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontFamily:C.mono,background:poll.active?C.tealL:C.border2,color:poll.active?C.teal:C.ink3,padding:"3px 10px",borderRadius:6,fontWeight:500}}>
                        {poll.active?"🟢 ACTIVE POLL":"⚫ CLOSED"}
                      </span>
                      {hasVoted&&<span style={{fontSize:10,fontFamily:C.mono,background:C.greenL,color:C.green,padding:"3px 10px",borderRadius:6,fontWeight:500}}>✓ You voted</span>}
                      <span style={{fontSize:11,fontFamily:C.mono,color:C.ink4,marginLeft:"auto"}}>{poll.totalVoters} total votes</span>
                    </div>
                    <div style={{fontFamily:C.serif,fontSize:17,fontWeight:700,marginBottom:18,lineHeight:1.4,color:C.ink}}>{poll.question}</div>

                    {!showResults?(
                      /* Voting UI */
                      <div>
                        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                          {poll.options.map((opt,i)=>(
                            <button key={i} onClick={()=>castVote(poll.id,i)}
                              style={{width:"100%",textAlign:"left",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,
                                background:"#fff",color:C.ink,fontSize:13,cursor:"pointer",fontFamily:C.sans,fontWeight:400,
                                transition:"all .15s",display:"flex",alignItems:"center",gap:10}}
                              onMouseEnter={e=>{e.currentTarget.style.borderColor=COLORS[i%COLORS.length];e.currentTarget.style.background=`${COLORS[i%COLORS.length]}0d`;}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="#fff";}}>
                              <span style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${COLORS[i%COLORS.length]}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <span style={{width:8,height:8,borderRadius:"50%",background:"transparent"}}/>
                              </span>
                              {opt}
                            </button>
                          ))}
                        </div>
                        <div style={{fontSize:11,fontFamily:C.mono,color:C.ink4}}>Click an option to cast your vote. Ends: {fmtD(poll.endsOn)}</div>
                      </div>
                    ):(
                      /* Results UI */
                      <div>
                        {poll.options.map((opt,i)=>{
                          const pct=poll.votes.reduce((a,v)=>a+v,0)>0?Math.round(poll.votes[i]/poll.votes.reduce((a,v)=>a+v,0)*100):0;
                          const isWinner=poll.votes[i]===maxV&&maxV>0;
                          const isMyVote=voted[poll.id]===i;
                          return(
                            <div key={i} style={{marginBottom:12}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                                <span style={{fontSize:13,color:C.ink,fontWeight:isWinner?600:400,display:"flex",alignItems:"center",gap:8}}>
                                  {isWinner&&<span style={{fontSize:12}}>🏆</span>}
                                  {isMyVote&&<span style={{fontSize:10,fontFamily:C.mono,color:C.teal,background:C.tealL,padding:"1px 6px",borderRadius:4}}>Your vote</span>}
                                  {opt}
                                </span>
                                <span style={{fontSize:12,fontFamily:C.mono,color:isWinner?COLORS[i%COLORS.length]:C.ink3,fontWeight:isWinner?600:400}}>{poll.votes[i]} votes · {pct}%</span>
                              </div>
                              <div style={{background:C.border2,borderRadius:99,height:12,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${pct}%`,background:COLORS[i%COLORS.length],borderRadius:99,transition:"width .8s ease",
                                  opacity:isWinner?1:0.6,boxShadow:isWinner?`0 0 10px ${COLORS[i%COLORS.length]}66`:""}}/>
                              </div>
                            </div>
                          );
                        })}
                        {!hasVoted&&!poll.active&&<div style={{marginTop:12,fontSize:11,fontFamily:C.mono,color:C.ink4}}>This poll is now closed.</div>}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ────────── ANALYTICS ────────── */}
        {page==="analytics"&&(
          <div className="fu" style={{paddingTop:28}}>
            <SectionTitle sub="Auto-calculated from live project data">Analytics Dashboard</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <Card style={{padding:22}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:2,letterSpacing:"0.06em",textTransform:"uppercase"}}>Projects by Category</div>
                <MiniBar data={[...new Set(data.projects.map(p=>p.category))].map(cat=>{const c=data.projects.filter(p=>p.category===cat).length;return{l:cat,v:c,top:c};})}/>
              </Card>
              <Card style={{padding:22}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:2,letterSpacing:"0.06em",textTransform:"uppercase"}}>Year-wise Projects</div>
                <MiniBar color={C.blue} data={[...new Set(data.projects.filter(p=>p.start).map(p=>p.start.slice(0,4)))].sort().map(yr=>{const c=data.projects.filter(p=>p.start?.startsWith(yr)).length;return{l:yr,v:c,top:c};})}/>
              </Card>
              <Card style={{padding:22}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:14,letterSpacing:"0.06em",textTransform:"uppercase"}}>Status Comparison</div>
                {["Completed","Ongoing","Approved","Pending"].map(st=>{
                  const c=data.projects.filter(x=>x.status===st).length;const pct=data.projects.length?Math.round(c/data.projects.length*100):0;
                  return(
                    <div key={st} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12,alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:7,height:7,borderRadius:"50%",background:ST[st].dot,display:"inline-block"}}/><span style={{color:C.ink2}}>{st}</span></div>
                        <span style={{fontFamily:C.mono,fontSize:11,color:C.ink3}}>{c} · {pct}%</span>
                      </div>
                      <ProgressBar value={c} max={data.projects.length} color={ST[st].dot}/>
                    </div>
                  );
                })}
              </Card>
              <Card style={{padding:22}}>
                <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:14,letterSpacing:"0.06em",textTransform:"uppercase"}}>Budget Utilization</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:18}}>
                  <div style={{fontFamily:C.serif,fontSize:46,fontWeight:700,color:C.saffron,lineHeight:1}}>{stats.budget>0?Math.round(stats.spent/stats.budget*100):0}<span style={{fontSize:22}}>%</span></div>
                  <div style={{paddingBottom:6,fontSize:12,color:C.ink3,fontWeight:300}}>of total budget utilized</div>
                </div>
                <ProgressBar value={stats.spent} max={stats.budget} color={`linear-gradient(90deg,${C.saffron},${C.green})`} h={10}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                  <div><div style={{fontSize:9,color:C.ink4,fontFamily:C.mono,marginBottom:2}}>SPENT</div><div style={{fontFamily:C.mono,fontSize:13,fontWeight:600}}>{fmtC(stats.spent)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.ink4,fontFamily:C.mono,marginBottom:2}}>ALLOCATED</div><div style={{fontFamily:C.mono,fontSize:13,fontWeight:600}}>{fmtC(stats.budget)}</div></div>
                </div>
              </Card>
            </div>
            {/* Top rated projects */}
            <Card style={{padding:22}}>
              <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:16,letterSpacing:"0.06em",textTransform:"uppercase"}}>Top Rated Projects (Citizen Reviews)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {data.projects.filter(p=>p.ratings>0).sort((a,b)=>b.rating-a.rating).slice(0,3).map((p,i)=>(
                  <div key={p.id} style={{padding:"14px 16px",background:C.bg,borderRadius:12,border:`1px solid ${C.border}`,cursor:"pointer"}}
                    onClick={()=>{setSP(p);setAT("feedback");setPage("works");}}>
                    <div style={{fontSize:11,fontFamily:C.mono,color:i===0?C.amber:C.ink3,fontWeight:600,marginBottom:6}}>
                      {i===0?"🥇":i===1?"🥈":"🥉"} #{i+1} Rated
                    </div>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:4,lineHeight:1.4}}>{p.scheme}</div>
                    <Stars val={p.rating} count={p.ratings} size={14}/>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ────────── SCHEMES ────────── */}
        {page==="schemes"&&(
          <div className="fu" style={{paddingTop:28}}>
            <SectionTitle sub="Check which government schemes you qualify for">Scheme Eligibility Checker</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:20}}>
              <Card style={{padding:24,alignSelf:"start"}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:18}}>📋 Enter Your Details</div>
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div><Label>Annual Family Income (₹)</Label><input type="number" value={schemeIncome} onChange={e=>setSI(e.target.value)} placeholder="e.g. 120000" style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none"}} onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/></div>
                  <SelF label="Social Category" value={schemeCat} onChange={e=>setSC(e.target.value)} options={["General","OBC","SC","ST"]}/>
                  <SelF label="Do you own agricultural land?" value={schemeLand} onChange={e=>setSL(e.target.value)} options={[{v:"yes",l:"Yes"},{v:"no",l:"No"}]}/>
                  <Btn onClick={checkEligibility} full>Check Eligibility →</Btn>
                </div>
              </Card>
              <div>
                {schemeResult===null?(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {SCHEMES_ELIGIBILITY.map(s=>(
                      <Card key={s.name} style={{padding:18}}>
                        <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                        <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{s.name}</div>
                        <div style={{fontSize:11,color:C.ink3,lineHeight:1.6,marginBottom:8}}>{s.desc}</div>
                        <div style={{fontSize:11,fontFamily:C.mono,color:C.green,background:C.greenL,padding:"4px 10px",borderRadius:6,display:"inline-block"}}>{s.benefit}</div>
                      </Card>
                    ))}
                  </div>
                ):(
                  <div>
                    <div style={{marginBottom:14,padding:"12px 16px",background:schemeResult.length>0?C.greenL:C.redL,borderRadius:10,border:`1px solid ${schemeResult.length>0?"#86efac":"#fca5a5"}`,color:schemeResult.length>0?"#14532d":C.red,fontSize:13,fontWeight:500}}>
                      {schemeResult.length>0?`✅ You may be eligible for ${schemeResult.length} scheme${schemeResult.length>1?"s":""}!`:"❌ No schemes matched. Visit panchayat office for guidance."}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {schemeResult.map(s=>(
                        <Card key={s.name} style={{padding:18,border:`1.5px solid ${C.green}`}}>
                          <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
                          <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{s.name}</div>
                          <div style={{fontSize:11,color:C.ink3,lineHeight:1.6,marginBottom:10}}>{s.desc}</div>
                          <div style={{fontSize:12,fontFamily:C.mono,color:C.green,background:C.greenL,padding:"5px 11px",borderRadius:7,display:"inline-block",fontWeight:500}}>🎯 {s.benefit}</div>
                        </Card>
                      ))}
                    </div>
                    <button onClick={()=>setSR(null)} style={{marginTop:14,background:"none",border:"none",color:C.saffron,fontFamily:C.sans,fontSize:13,cursor:"pointer",fontWeight:500}}>← Check again</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ────────── GRIEVANCE ────────── */}
        {page==="grievance"&&(
          <div className="fu" style={{paddingTop:28,maxWidth:640}}>
            <SectionTitle sub="Submit a complaint or track using your Ticket ID">Grievance Portal</SectionTitle>
            <div style={{display:"flex",gap:0,marginBottom:26,background:C.card,borderRadius:12,padding:4,border:`1px solid ${C.border}`,width:"fit-content"}}>
              {[["raise","📝 Raise Demand"],["track","🔍 Track Status"]].map(([id,l])=>(
                <button key={id} onClick={()=>{setGTab(id);setSub(null);setOtpSent(false);setOtpOk(false);setOtp("");setTrackRes(null);setTrackQ("");}}
                  style={{padding:"9px 22px",background:gTab===id?`linear-gradient(135deg,${C.saffron},${C.saffronD})`:"none",border:"none",borderRadius:9,color:gTab===id?"#fff":C.ink3,fontFamily:C.sans,fontSize:13,cursor:"pointer",fontWeight:gTab===id?600:400,transition:"all .2s"}}>
                  {l}
                </button>
              ))}
            </div>

            {gTab==="raise"&&(
              <Card>
                {subTicket?(
                  <div style={{padding:"44px 34px",textAlign:"center"}} className="si">
                    <div style={{width:58,height:58,borderRadius:"50%",background:C.greenL,border:`2px solid #86efac`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:26}}>✅</div>
                    <div style={{fontFamily:C.serif,fontSize:23,fontWeight:700,margin:"0 0 6px"}}>Demand Submitted!</div>
                    <p style={{color:C.ink3,fontSize:13,margin:"0 0 26px",fontWeight:300}}>Save your Ticket ID for tracking anytime.</p>
                    <div style={{background:`linear-gradient(130deg,${C.ink},#2d2926)`,borderRadius:16,padding:"22px 32px",marginBottom:24,display:"inline-block",minWidth:270}}>
                      <div style={{fontSize:10,fontFamily:C.mono,color:"rgba(255,255,255,0.45)",letterSpacing:"0.12em",marginBottom:8,textTransform:"uppercase"}}>Ticket ID</div>
                      <div style={{fontFamily:C.mono,fontSize:26,fontWeight:700,color:C.saffron,letterSpacing:"0.06em"}}>{subTicket}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:C.mono,marginTop:8}}>Use this to track your complaint anytime</div>
                    </div>
                    <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                      <Btn onClick={()=>{setGTab("track");setTrackQ(subTicket);setSub(null);}}>Track This Ticket →</Btn>
                      <Btn variant="secondary" onClick={()=>{setSub(null);setGf({name:"",mobile:"",email:"",village:"",category:"Road Repair",description:"",image:null});setOtpSent(false);setOtpOk(false);setOtp("");}}>Submit Another</Btn>
                    </div>
                  </div>
                ):(
                  <div style={{padding:26,display:"flex",flexDirection:"column",gap:16}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      <Field label="Full Name *" value={gf.name} onChange={e=>setGf(f=>({...f,name:e.target.value}))}/>
                      <Field label="Email (Optional)" value={gf.email} type="email" onChange={e=>setGf(f=>({...f,email:e.target.value}))}/>
                    </div>
                    <Field label="Village *" value={gf.village} onChange={e=>setGf(f=>({...f,village:e.target.value}))}/>
                    <div>
                      <Label>Mobile Number * (OTP Verification)</Label>
                      <div style={{display:"flex",gap:10}}>
                        <input type="tel" maxLength={10} value={gf.mobile} onChange={e=>setGf(f=>({...f,mobile:e.target.value}))} placeholder="10-digit mobile" disabled={otpOk}
                          style={{flex:1,background:otpOk?"#fafaf8":"#fff",border:`1.5px solid ${otpOk?C.green:C.border}`,borderRadius:10,padding:"10px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none",fontWeight:300}}/>
                        {!otpSent&&!otpOk&&<Btn onClick={sendOtp}>Send OTP</Btn>}
                        {otpOk&&<div style={{padding:"10px 14px",background:C.greenL,borderRadius:10,color:C.green,fontFamily:C.mono,fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:5}}>✓ Verified</div>}
                      </div>
                      {mobErr&&<div style={{color:C.red,fontSize:11,fontFamily:C.mono,marginTop:4}}>{mobErr}</div>}
                      {otpSent&&!otpOk&&(
                        <div style={{display:"flex",gap:10,marginTop:8}}>
                          <input type="text" maxLength={4} value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 4-digit OTP"
                            style={{flex:1,background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.ink,fontSize:14,fontFamily:C.mono,outline:"none"}}
                            onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
                          <Btn onClick={verOtp}>Verify OTP</Btn>
                        </div>
                      )}
                      {otpSent&&!otpOk&&<div style={{fontSize:10,color:C.ink4,fontFamily:C.mono,marginTop:4}}>Demo mode — enter any 4 digits</div>}
                    </div>
                    <SelF label="Issue Category *" value={gf.category} onChange={e=>setGf(f=>({...f,category:e.target.value}))} options={["Road Repair","Water Supply","Electricity","Sanitation","Housing","Education","Healthcare","Drainage","Other"]}/>
                    <Field label="Description *" value={gf.description} onChange={e=>setGf(f=>({...f,description:e.target.value}))} rows={4} placeholder="Describe the issue — location, impact, how long ongoing…"/>
                    <div>
                      <Label>Attach Image (Optional)</Label>
                      <label style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"#fafaf8",border:`2px dashed ${C.border}`,borderRadius:10,cursor:"pointer",transition:"all .2s"}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.saffron;e.currentTarget.style.background=C.saffronL;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="#fafaf8";}}>
                        {gf.image?<img src={gf.image} style={{width:42,height:42,objectFit:"cover",borderRadius:8}} alt=""/>:<span style={{fontSize:20}}>📷</span>}
                        <span style={{fontSize:12,color:gf.image?C.green:C.ink3,fontWeight:gf.image?500:300}}>{gf.image?"Image selected":"Select image to attach"}</span>
                        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setGf(x=>({...x,image:ev.target.result}));r.readAsDataURL(f);}} style={{display:"none"}}/>
                      </label>
                    </div>
                    <Btn onClick={submit} disabled={!otpOk||!gf.name||!gf.village||!gf.description} full>Submit & Get Ticket ID</Btn>
                    <div style={{padding:"10px 14px",background:"#fafaf8",borderRadius:9,border:`1px solid ${C.border}`}}>
                      <p style={{fontSize:10,fontFamily:C.mono,color:C.ink4,lineHeight:1.8,margin:0}}>🔒 Mobile number never shown publicly · Unique Ticket ID generated · Privacy policy applies</p>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {gTab==="track"&&(
              <div>
                <Card style={{padding:22,marginBottom:16}}>
                  <Label>Enter Ticket ID or Mobile Number</Label>
                  <div style={{display:"flex",gap:10}}>
                    <input value={trackQ} onChange={e=>setTrackQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&track()}
                      placeholder="e.g. LD-A3F2-2891 or last 4 digits of mobile"
                      style={{flex:1,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 16px",color:C.ink,fontSize:13,fontFamily:C.mono,outline:"none"}}
                      onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
                    <Btn onClick={track}>Track →</Btn>
                  </div>
                  <div style={{marginTop:10,padding:"9px 13px",background:C.saffronL,borderRadius:8,fontSize:11,fontFamily:C.mono,color:C.saffronD}}>
                    💡 Use Ticket ID like <strong>LD-A3F2-2891</strong> or last 4 digits of your mobile
                  </div>
                </Card>
                {trackRes!==null&&(
                  trackRes.length===0?(
                    <Card style={{padding:"32px",textAlign:"center"}}>
                      <div style={{fontSize:34,marginBottom:10}}>🔍</div>
                      <div style={{fontWeight:700,fontSize:15,marginBottom:5}}>No Results Found</div>
                      <div style={{color:C.ink3,fontSize:13}}>No grievances found for this ID or number.</div>
                    </Card>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {trackRes.map(g=>(
                        <Card key={g.id} className="si" style={{padding:22}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                            <div>
                              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.ink,borderRadius:8,padding:"5px 14px",marginBottom:10}}>
                                <span style={{fontSize:9,fontFamily:C.mono,color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em"}}>TICKET ID</span>
                                <span style={{fontFamily:C.mono,fontSize:14,fontWeight:700,color:C.saffron}}>{g.ticketId}</span>
                              </div>
                              <div style={{fontWeight:600,fontSize:15,marginBottom:2}}>{g.category}</div>
                              <div style={{fontSize:11,fontFamily:C.mono,color:C.ink4}}>📍 {g.village} · 📅 {g.date}</div>
                            </div>
                            <Badge status={g.status} dict={GT} size="lg"/>
                          </div>
                          <div style={{background:C.bg,borderRadius:9,padding:"12px 14px",fontSize:13,color:C.ink2,lineHeight:1.7,marginBottom:16}}>{g.description}</div>
                          <div>
                            <div style={{fontSize:10,fontFamily:C.mono,color:C.ink3,marginBottom:12,letterSpacing:"0.06em",textTransform:"uppercase"}}>Progress</div>
                            <div style={{display:"flex",alignItems:"flex-start"}}>
                              {["Submitted","Under Review","Resolved"].map((step,si)=>{
                                const steps=["Submitted","Under Review","Resolved"];
                                const ci=g.status==="Rejected"?0:steps.indexOf(g.status);
                                const done=si<=ci;const active=si===ci&&g.status!=="Rejected";
                                return(
                                  <div key={step} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                                    {si<2&&<div style={{position:"absolute",top:13,left:"50%",width:"100%",height:2,background:done&&si<ci?C.green:C.border2,zIndex:0,transition:"background .4s"}}/>}
                                    <div style={{width:27,height:27,borderRadius:"50%",background:done?(active?C.saffron:C.green):"#fff",border:`2px solid ${done?(active?C.saffron:C.green):C.border}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,fontSize:11,transition:"all .3s"}}>
                                      {done&&!active?<span style={{color:"#fff",fontSize:13}}>✓</span>:active?<span style={{width:7,height:7,borderRadius:"50%",background:"#fff",display:"block"}}/>:<span style={{width:5,height:5,borderRadius:"50%",background:C.border,display:"block"}}/>}
                                    </div>
                                    <div style={{fontSize:10,fontFamily:C.mono,marginTop:6,color:done?C.ink:C.ink4,fontWeight:done?500:400,textAlign:"center"}}>{step}</div>
                                  </div>
                                );
                              })}
                            </div>
                            {g.status==="Rejected"&&<div style={{marginTop:12,padding:"9px 13px",background:C.redL,borderRadius:8,color:C.red,fontSize:12,fontFamily:C.mono}}>✕ This grievance has been rejected.</div>}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

      </main>

      <footer style={{background:C.card,borderTop:`1px solid ${C.border}`,padding:"18px 28px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.saffron},${C.saffronD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👁️</div>
            <span style={{fontFamily:C.serif,fontSize:14,color:C.ink2}}>LokDrishti · {data.leader.constituency}</span>
          </div>
          <span style={{fontSize:10,fontFamily:C.mono,color:C.ink4}}>Phone numbers never public · Privacy Policy · © 2024 LokDrishti</span>
        </div>
      </footer>
    </div>
  );
}

/* ── LOGIN ──────────────────────────────────────────────────── */
const ADMIN_USER = "alkajhaparjuar";
const ADMIN_PASS = "Armaan@27119";

function Login({onLogin}) {
  const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");const [showP,setShowP]=useState(false);
  const go=()=>{if(u===ADMIN_USER&&p===ADMIN_PASS)onLogin();else{setErr("Invalid credentials.");setP("");}};
  const onKey=e=>{if(e.key==="Enter")go();};
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.ink} 0%,#2d2926 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.sans}}>
      <div style={{width:380}} className="si">
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:58,height:58,borderRadius:16,background:`linear-gradient(135deg,${C.saffron},${C.saffronD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px",boxShadow:`0 4px 20px rgba(224,123,57,0.4)`}}>👁️</div>
          <div style={{fontFamily:C.serif,fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.02em"}}>LokDrishti</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:C.mono,marginTop:5,letterSpacing:"0.14em",textTransform:"uppercase"}}>Secure Admin Portal</div>
        </div>
        <Card style={{padding:28}}>
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div>
              <Label>Username</Label>
              <input value={u} onChange={e=>setU(e.target.value)} onKeyDown={onKey} placeholder="Enter username" autoComplete="off"
                style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none",transition:"border-color .15s"}}
                onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <div>
              <Label>Password</Label>
              <div style={{position:"relative"}}>
                <input type={showP?"text":"password"} value={p} onChange={e=>setP(e.target.value)} onKeyDown={onKey} placeholder="Enter password" autoComplete="current-password"
                  style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 42px 11px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none",transition:"border-color .15s",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor=C.saffron} onBlur={e=>e.target.style.borderColor=C.border}/>
                <button onClick={()=>setShowP(s=>!s)} tabIndex={-1}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.ink3,fontSize:14,padding:2}}>
                  {showP?"🙈":"👁"}
                </button>
              </div>
            </div>
            {err&&<div style={{color:C.red,fontSize:12,fontFamily:C.mono,padding:"9px 13px",background:C.redL,borderRadius:8,display:"flex",alignItems:"center",gap:6}}><span>⚠️</span>{err}</div>}
            <Btn onClick={go} disabled={!u||!p} full>Sign In →</Btn>
          </div>
          <div style={{textAlign:"center",marginTop:16,fontSize:10,fontFamily:C.mono,color:C.ink4}}>🔒 Secured portal · Authorised access only</div>
        </Card>
      </div>
    </div>
  );
}

/* ── SUPABASE CONFIG ────────────────────────────────────────── */
const SUPABASE_URL = "https://eoqpaodhunbxzukaxisa.supabase.co";
const SUPABASE_KEY = "sb_publishable_BJB68ZPrMJGnnqvSUtVkqA_rBR9DdOw";

// Lightweight Supabase helper (no npm needed)
const sb = {
  async get(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async upsert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async update(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json", Prefer: "return=representation"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json", Prefer: "return=representation"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async delete(table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

// Convert Supabase row → app format
function mapProject(r) {
  return {
    id: r.id, scheme: r.scheme, panchayat: r.panchayat, village: r.village,
    budget: r.budget, spent: r.spent, beneficiaries: r.beneficiaries,
    start: r.start_date, completion: r.completion_date, status: r.status,
    category: r.category, beforeImg: r.before_img, afterImg: r.after_img,
    rating: r.rating, ratings: r.ratings,
    reviews: r.reviews || [], milestones: r.milestones || [],
  };
}
function mapMeeting(r) {
  return {
    id: r.id, title: r.title, date: r.date, type: r.type, venue: r.venue,
    agenda: r.agenda || [], decisions: r.decisions || [],
    attendance: r.attendance, totalMembers: r.total_members,
    status: r.status, minutes: r.minutes,
  };
}
function mapGrievance(r) {
  return {
    id: r.id, ticketId: r.ticket_id, name: r.name, mobile: r.mobile,
    email: r.email, village: r.village, category: r.category,
    description: r.description, image: r.image, status: r.status, date: r.date,
  };
}
function mapNotice(r) {
  return { id: r.id, title: r.title, date: r.date, category: r.category, content: r.content, important: r.important };
}
function mapPoll(r) {
  return {
    id: r.id, question: r.question, options: r.options || [], votes: r.votes || [],
    active: r.active, created: r.created, endsOn: r.ends_on, totalVoters: r.total_voters,
  };
}

// Convert app format → Supabase row
function toDbProject(p) {
  return {
    ...(p.id && typeof p.id === 'number' && p.id < 1e10 ? {id: p.id} : {}),
    scheme: p.scheme, panchayat: p.panchayat, village: p.village,
    budget: p.budget, spent: p.spent, beneficiaries: p.beneficiaries,
    start_date: p.start || null, completion_date: p.completion || null,
    status: p.status, category: p.category,
    before_img: p.beforeImg || null, after_img: p.afterImg || null,
    rating: p.rating || 0, ratings: p.ratings || 0,
    reviews: p.reviews || [], milestones: p.milestones || [],
  };
}
function toDbMeeting(m) {
  return {
    ...(m.id && typeof m.id === 'number' && m.id < 1e10 ? {id: m.id} : {}),
    title: m.title, date: m.date, type: m.type, venue: m.venue,
    agenda: m.agenda || [], decisions: m.decisions || [],
    attendance: m.attendance, total_members: m.totalMembers,
    status: m.status, minutes: m.minutes,
  };
}
function toDbGrievance(g) {
  return {
    ticket_id: g.ticketId, name: g.name, mobile: g.mobile, email: g.email,
    village: g.village, category: g.category, description: g.description,
    image: g.image || null, status: g.status, date: g.date,
  };
}
function toDbNotice(n) {
  return { title: n.title, date: n.date, category: n.category, content: n.content, important: n.important || false };
}
function toDbPoll(p) {
  return {
    question: p.question, options: p.options || [], votes: p.votes || [],
    active: p.active, created: p.created, ends_on: p.endsOn, total_voters: p.totalVoters || 0,
  };
}

/* ── ROOT ───────────────────────────────────────────────────── */
const DEFAULT_DATA = {leader:LEADER0,projects:PROJECTS0,grievances:GRIEVANCES0,meetings:MEETINGS0,notices:NOTICES0,polls:POLLS0};

export default function App() {
  const [view,setView]=useState("public");
  const [data,setData]=useState(DEFAULT_DATA);
  const [loading,setLoading]=useState(true);
  const [dbReady,setDbReady]=useState(false);
  const [contractor,setContractor]=useState(null);

  // Load all data from Supabase on mount
  useEffect(()=>{
    async function fetchAll() {
      try {
        const [leaders,projects,grievances,meetings,notices,polls] = await Promise.all([
          sb.get("leader"), sb.get("projects"), sb.get("grievances"),
          sb.get("meetings"), sb.get("notices"), sb.get("polls"),
        ]);
        if(leaders && leaders.length > 0) {
          setData({
            leader: leaders[0],
            projects: (projects||[]).map(mapProject),
            grievances: (grievances||[]).map(mapGrievance),
            meetings: (meetings||[]).map(mapMeeting),
            notices: (notices||[]).map(mapNotice),
            polls: (polls||[]).map(mapPoll),
          });
          setDbReady(true);
        } else {
          // DB empty — seed with default data
          setDbReady(false);
        }
      } catch(e) {
        console.error("Supabase load error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  },[]);

  // updateData — saves to Supabase + updates local state
  const updateData = (updater) => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      // Async Supabase sync
      (async () => {
        try {
          // Leader
          if(next.leader !== prev.leader) {
            if(next.leader.id) await sb.update("leader", next.leader.id, next.leader);
            else await sb.insert("leader", next.leader);
          }
          // Projects
          for(const p of next.projects) {
            const old = prev.projects.find(x=>x.id===p.id);
            if(!old) await sb.insert("projects", toDbProject(p));
            else if(JSON.stringify(p)!==JSON.stringify(old)) await sb.update("projects", p.id, toDbProject(p));
          }
          // Deleted projects
          for(const p of prev.projects) {
            if(!next.projects.find(x=>x.id===p.id)) await sb.delete("projects", p.id);
          }
          // Meetings
          for(const m of next.meetings) {
            const old = prev.meetings.find(x=>x.id===m.id);
            if(!old) await sb.insert("meetings", toDbMeeting(m));
            else if(JSON.stringify(m)!==JSON.stringify(old)) await sb.update("meetings", m.id, toDbMeeting(m));
          }
          for(const m of prev.meetings) {
            if(!next.meetings.find(x=>x.id===m.id)) await sb.delete("meetings", m.id);
          }
          // Grievances
          for(const g of next.grievances) {
            const old = prev.grievances.find(x=>x.id===g.id);
            if(!old) await sb.insert("grievances", toDbGrievance(g));
            else if(JSON.stringify(g)!==JSON.stringify(old)) await sb.update("grievances", g.id, {status: g.status});
          }
          // Notices
          for(const n of next.notices) {
            const old = prev.notices.find(x=>x.id===n.id);
            if(!old) await sb.insert("notices", toDbNotice(n));
          }
          for(const n of prev.notices) {
            if(!next.notices.find(x=>x.id===n.id)) await sb.delete("notices", n.id);
          }
          // Polls
          for(const p of next.polls) {
            const old = prev.polls.find(x=>x.id===p.id);
            if(!old) await sb.insert("polls", toDbPoll(p));
            else if(JSON.stringify(p)!==JSON.stringify(old)) await sb.update("polls", p.id, toDbPoll(p));
          }
          for(const p of prev.polls) {
            if(!next.polls.find(x=>x.id===p.id)) await sb.delete("polls", p.id);
          }
        } catch(e) { console.error("Supabase save error:", e); }
      })();

      return next;
    });
  };

  if(loading) return(
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f2f0eb",flexDirection:"column",gap:16}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#1c1917",display:"flex",alignItems:"center",gap:10}}>
        <span>👁️</span> LokDrishti
      </div>
      <div style={{fontSize:13,color:"#736f69",fontFamily:"monospace",letterSpacing:"0.1em"}}>Loading from Supabase...</div>
      <div style={{width:40,height:40,border:"3px solid #e6e3db",borderTop:"3px solid #e07b39",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return(
    <div>
      {!dbReady && (
        <div style={{position:"fixed",top:0,left:0,right:0,background:"#fef3c7",padding:"8px 20px",fontSize:12,fontFamily:"monospace",zIndex:9999,textAlign:"center",color:"#78350f"}}>
          ⚠️ Supabase tables empty — Please run the SQL setup file first!
        </div>
      )}
      <div className="admin-bar" style={{position:"fixed",bottom:20,right:20,zIndex:9999,display:"flex",gap:3,background:"rgba(28,25,23,0.92)",backdropFilter:"blur(12px)",borderRadius:12,padding:4,boxShadow:"0 4px 20px rgba(0,0,0,0.22)"}}>
        <button onClick={()=>setView("public")} style={{padding:"7px 16px",background:view==="public"?`linear-gradient(135deg,${C.saffron},${C.saffronD})`:"none",border:"none",borderRadius:8,color:view==="public"?"#fff":"rgba(255,255,255,0.38)",fontSize:11,fontFamily:C.mono,cursor:"pointer",fontWeight:500,letterSpacing:"0.04em"}}>🌐 Public</button>
        <button onClick={()=>setView(view==="admin"?"public":"login")} style={{padding:"7px 16px",background:view==="admin"?`linear-gradient(135deg,${C.saffron},${C.saffronD})`:"none",border:"none",borderRadius:8,color:view==="admin"?"#fff":"rgba(255,255,255,0.38)",fontSize:11,fontFamily:C.mono,cursor:"pointer",fontWeight:500,letterSpacing:"0.04em"}}>🔐 Admin</button>
        <button onClick={()=>setView(view==="contractor"?"public":"contractor-login")} style={{padding:"7px 16px",background:view==="contractor"?`linear-gradient(135deg,${C.teal},#0f766e)`:"none",border:"none",borderRadius:8,color:view==="contractor"?"#fff":"rgba(255,255,255,0.38)",fontSize:11,fontFamily:C.mono,cursor:"pointer",fontWeight:500,letterSpacing:"0.04em"}}>👷 Worker</button>
      </div>
      {view==="public"&&<Public data={data} setData={updateData}/>}
      {view==="login"&&<Login onLogin={()=>setView("admin")}/>}
      {view==="admin"&&<Admin data={data} setData={updateData} onLogout={()=>setView("public")}/>}
      {view==="contractor-login"&&<ContractorLogin onLogin={(c)=>{setContractor(c);setView("contractor");}} onBack={()=>setView("public")}/>}
      {view==="contractor"&&contractor&&<ContractorPortal contractor={contractor} data={data} setData={updateData} onLogout={()=>{setContractor(null);setView("public");}}/>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CONTRACTOR LOGIN
════════════════════════════════════════════════════════════════ */
function ContractorLogin({onLogin, onBack}) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [showP,setShowP]=useState(false);

  const login=async()=>{
    if(!email||!pass){setErr("Email aur password dono bharo");return;}
    setLoading(true);setErr("");
    try {
      const res=await fetch(`${SUPABASE_URL}/rest/v1/contractors?email=eq.${encodeURIComponent(email)}&active=eq.true&select=*`,{
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}
      });
      const data=await res.json();
      if(!data||data.length===0){setErr("Email nahi mila");setLoading(false);return;}
      const c=data[0];
      if(c.password_hash!==pass){setErr("Password galat hai");setLoading(false);return;}
      onLogin(c);
    } catch(e){setErr("Connection error");} finally{setLoading(false);}
  };

  return(
    <div style={{minHeight:"100vh",background:"#f0ede6",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${C.teal},#0f766e)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}}>👷</div>
          <div style={{fontFamily:C.serif,fontSize:24,fontWeight:700,color:C.ink}}>Worker Portal</div>
          <div style={{fontSize:12,color:C.ink3,fontFamily:C.mono,marginTop:4}}>LokDrishti Field Worker Login</div>
        </div>
        <Card style={{padding:28}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <Label>Email / Username</Label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="aapka email"
                style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <div>
              <Label>Password</Label>
              <div style={{position:"relative"}}>
                <input type={showP?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&login()} placeholder="password"
                  style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 42px 11px 14px",color:C.ink,fontSize:13,fontFamily:C.sans,outline:"none",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
                <button onClick={()=>setShowP(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:14}}>{showP?"🙈":"👁"}</button>
              </div>
            </div>
            {err&&<div style={{color:C.red,fontSize:12,padding:"8px 12px",background:C.redL,borderRadius:8}}>⚠️ {err}</div>}
            <button onClick={login} disabled={loading}
              style={{padding:"11px",borderRadius:10,background:`linear-gradient(135deg,${C.teal},#0f766e)`,color:"#fff",border:"none",fontSize:13,fontFamily:C.sans,fontWeight:600,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1}}>
              {loading?"Logging in...":"Login करें →"}
            </button>
            <button onClick={onBack} style={{background:"none",border:"none",color:C.ink3,fontSize:12,cursor:"pointer",fontFamily:C.sans}}>← Public Site pe Wapas</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CONTRACTOR PORTAL
════════════════════════════════════════════════════════════════ */
function ContractorPortal({contractor, data, setData, onLogout}) {
  const [tab,setTab]=useState("dashboard");
  const [assignments,setAssignments]=useState([]);
  const [logs,setLogs]=useState([]);
  const [photos,setPhotos]=useState([]);
  const [notifications,setNotifications]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selProject,setSelProject]=useState(null);
  const [logForm,setLogForm]=useState({workers_count:"",materials_used:"",progress_percent:"",notes:"",status:"Ongoing"});
  const [photoForm,setPhotoForm]=useState({caption:"",photo_type:"during",file:null,preview:null,lat:null,lng:null});
  const [submitting,setSubmitting]=useState(false);
  const [msg,setMsg]=useState("");

  useEffect(()=>{loadAll();},[]);

  const loadAll=async()=>{
    setLoading(true);
    try {
      const [asgn,lg,ph,notifs]=await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/project_assignments?contractor_id=eq.${contractor.id}&select=*`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/work_logs?contractor_id=eq.${contractor.id}&select=*&order=created_at.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/work_photos?contractor_id=eq.${contractor.id}&select=*&order=taken_at.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/notifications?or=(target.eq.all,contractor_id.eq.${contractor.id})&order=created_at.desc&limit=20`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.json()),
      ]);
      setAssignments(asgn||[]);
      setLogs(lg||[]);
      setPhotos(ph||[]);
      setNotifications(notifs||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };

  const assignedProjects=data.projects.filter(p=>assignments.find(a=>a.project_id===p.id));
  const unread=notifications.filter(n=>!n.read).length;

  const getLocation=()=>{
    if(!navigator.geolocation){setMsg("GPS supported nahi hai");return;}
    navigator.geolocation.getCurrentPosition(pos=>{
      setPhotoForm(f=>({...f,lat:pos.coords.latitude,lng:pos.coords.longitude}));
      setMsg("📍 Location capture ho gayi!");
      setTimeout(()=>setMsg(""),3000);
    },()=>setMsg("Location allow karo browser mein"));
  };

  const submitLog=async()=>{
    if(!selProject){setMsg("Pehle project select karo");return;}
    if(!logForm.notes){setMsg("Notes likhna zaroori hai");return;}
    setSubmitting(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/work_logs`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json",Prefer:"return=representation"},
        body:JSON.stringify({project_id:selProject.id,contractor_id:contractor.id,workers_count:parseInt(logForm.workers_count)||0,materials_used:logForm.materials_used,progress_percent:parseInt(logForm.progress_percent)||0,notes:logForm.notes,status:logForm.status,log_date:new Date().toISOString().split("T")[0]})
      });
      // Update project milestone/progress in main data
      if(logForm.progress_percent) {
        const updatedMilestones=selProject.milestones?.map((m,i)=>{
          const pct=parseInt(logForm.progress_percent);
          if(pct>=100&&i===selProject.milestones.length-1) return {...m,done:true};
          return m;
        });
        setData(d=>({...d,projects:d.projects.map(p=>p.id===selProject.id?{...p,milestones:updatedMilestones,status:logForm.status==="Completed"?"Completed":p.status}:p)}));
      }
      setMsg("✅ Daily log submit ho gaya!");
      setLogForm({workers_count:"",materials_used:"",progress_percent:"",notes:"",status:"Ongoing"});
      loadAll();
    } catch(e){setMsg("Error aaya, dobara try karo");} finally{setSubmitting(false);setTimeout(()=>setMsg(""),4000);}
  };

  const submitPhoto=async()=>{
    if(!selProject||!photoForm.file){setMsg("Project aur photo dono select karo");return;}
    setSubmitting(true);
    try {
      // Upload to Supabase Storage
      const fname=`${contractor.id}/${selProject.id}/${Date.now()}_${photoForm.file.name}`;
      const uploadRes=await fetch(`${SUPABASE_URL}/storage/v1/object/work-photos/${fname}`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":photoForm.file.type},
        body:photoForm.file
      });
      if(!uploadRes.ok){setMsg("Photo upload failed");setSubmitting(false);return;}
      const photoUrl=`${SUPABASE_URL}/storage/v1/object/public/work-photos/${fname}`;
      await fetch(`${SUPABASE_URL}/rest/v1/work_photos`,{
        method:"POST",
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify({project_id:selProject.id,contractor_id:contractor.id,photo_url:photoUrl,caption:photoForm.caption,photo_type:photoForm.photo_type,lat:photoForm.lat,lng:photoForm.lng})
      });
      setMsg("✅ Photo upload ho gayi!");
      setPhotoForm({caption:"",photo_type:"during",file:null,preview:null,lat:null,lng:null});
      loadAll();
    } catch(e){setMsg("Error aaya");} finally{setSubmitting(false);setTimeout(()=>setMsg(""),4000);}
  };

  const markRead=async(id)=>{
    await fetch(`${SUPABASE_URL}/rest/v1/notifications?id=eq.${id}`,{
      method:"PATCH",
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({read:true})
    });
    setNotifications(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  };

  const TABS=[["dashboard","📊","Dashboard"],["update","📝","Daily Log"],["photos","📸","Photos Upload"],["notifs","🔔","Notifications"]];

  if(loading) return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}><div style={{width:40,height:40,border:`3px solid ${C.teal}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{color:C.ink3,fontFamily:C.mono,fontSize:13}}>Loading...</div></div>;

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:C.sans,color:C.ink,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:200,background:`linear-gradient(180deg,#0d4a42,#0f766e)`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 16px 14px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontFamily:C.serif,fontSize:16,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:8}}><span>👷</span>Worker Portal</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontFamily:C.mono,marginTop:4,letterSpacing:"0.05em"}}>{contractor.name}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontFamily:C.mono}}>{contractor.company||"Field Worker"}</div>
        </div>
        <nav style={{padding:"8px 0",flex:1}}>
          {TABS.map(([id,ic,l])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{width:"100%",textAlign:"left",padding:"10px 16px",background:tab===id?"rgba(255,255,255,0.15)":"none",border:"none",borderLeft:tab===id?"3px solid #5eead4":"3px solid transparent",color:tab===id?"#fff":"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer",fontFamily:C.sans,display:"flex",alignItems:"center",gap:8,position:"relative"}}>
              <span>{ic}</span>{l}
              {id==="notifs"&&unread>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:99,fontSize:9,padding:"1px 6px",fontFamily:C.mono,marginLeft:"auto"}}>{unread}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <button onClick={onLogout} style={{width:"100%",padding:"8px",borderRadius:8,background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.6)",fontSize:11,cursor:"pointer",fontFamily:C.sans}}>← Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflow:"auto",padding:"24px",background:"#f0ede6"}}>
        {msg&&<div style={{position:"fixed",top:20,right:20,background:msg.startsWith("✅")?C.greenL:C.redL,color:msg.startsWith("✅")?"#14532d":C.red,padding:"10px 18px",borderRadius:10,fontSize:13,fontFamily:C.mono,zIndex:9999,boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>{msg}</div>}

        {/* DASHBOARD */}
        {tab==="dashboard"&&(
          <div className="fu">
            <SectionTitle sub={`Welcome back, ${contractor.name}!`}>Mera Dashboard</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              {[["Assigned Projects",assignedProjects.length,C.teal,"🏗"],["Total Logs",logs.length,C.blue,"📋"],["Photos Uploaded",photos.length,C.purple,"📸"]].map(([l,v,cl,ic])=>(
                <Card key={l} style={{padding:18}}>
                  <div style={{fontSize:22,marginBottom:8}}>{ic}</div>
                  <div style={{fontFamily:C.serif,fontSize:28,fontWeight:700,color:cl}}>{v}</div>
                  <div style={{fontSize:12,color:C.ink3,marginTop:4}}>{l}</div>
                </Card>
              ))}
            </div>
            <SectionTitle sub="Tumhare assigned projects">Mere Projects</SectionTitle>
            {assignedProjects.length===0?<Card style={{padding:24,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>📭</div><div style={{color:C.ink3}}>Abhi koi project assign nahi hua</div></Card>:(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {assignedProjects.map(p=>(
                  <Card key={p.id} style={{padding:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div>
                        <div style={{fontFamily:C.serif,fontSize:16,fontWeight:700,color:C.ink}}>{p.scheme}</div>
                        <div style={{fontSize:12,color:C.ink3,marginTop:3}}>📍 {p.village} · {p.panchayat}</div>
                      </div>
                      <Badge status={p.status} dict={ST}/>
                    </div>
                    <ProgressBar value={p.spent} max={p.budget} color={C.teal}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,fontFamily:C.mono,color:C.ink4}}>
                      <span>Budget: {fmtC(p.budget)}</span>
                      <span>Spent: {fmtC(p.spent)}</span>
                    </div>
                    {p.milestones?.length>0&&<div style={{marginTop:12}}><Timeline milestones={p.milestones}/></div>}
                    <div style={{marginTop:12,display:"flex",gap:8}}>
                      <Btn sm onClick={()=>{setSelProject(p);setTab("update");}}>📝 Log Update</Btn>
                      <Btn sm variant="secondary" onClick={()=>{setSelProject(p);setTab("photos");}}>📸 Photo Upload</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DAILY LOG */}
        {tab==="update"&&(
          <div className="fu">
            <SectionTitle sub="Aaj ka kaam record karo">Daily Work Log</SectionTitle>
            <Card style={{padding:24,maxWidth:600}}>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div>
                  <Label>Project Select Karo *</Label>
                  <select value={selProject?.id||""} onChange={e=>setSelProject(assignedProjects.find(p=>p.id===parseInt(e.target.value))||null)}
                    style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:C.sans,background:"#fff",color:C.ink,outline:"none"}}>
                    <option value="">-- Project chuniye --</option>
                    {assignedProjects.map(p=><option key={p.id} value={p.id}>{p.scheme} — {p.village}</option>)}
                  </select>
                </div>
                <Field label="Aaj Kitne Workers Aaye" type="number" value={logForm.workers_count} onChange={e=>setLogForm(f=>({...f,workers_count:e.target.value}))} placeholder="e.g. 15"/>
                <Field label="Materials Used (cement, rod, bricks...)" value={logForm.materials_used} onChange={e=>setLogForm(f=>({...f,materials_used:e.target.value}))} placeholder="e.g. 50 bags cement, 2 ton rod"/>
                <div>
                  <Label>Progress % (0-100)</Label>
                  <input type="range" min="0" max="100" value={logForm.progress_percent||0} onChange={e=>setLogForm(f=>({...f,progress_percent:e.target.value}))}
                    style={{width:"100%",accentColor:C.teal}}/>
                  <div style={{textAlign:"right",fontSize:12,fontFamily:C.mono,color:C.teal,fontWeight:600}}>{logForm.progress_percent||0}% Complete</div>
                </div>
                <div>
                  <Label>Current Status</Label>
                  <select value={logForm.status} onChange={e=>setLogForm(f=>({...f,status:e.target.value}))}
                    style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:C.sans,background:"#fff",outline:"none"}}>
                    <option>Ongoing</option>
                    <option>Under Review</option>
                    <option>Completed</option>
                  </select>
                </div>
                <Field label="Aaj Kya Kaam Hua (Notes) *" rows={4} value={logForm.notes} onChange={e=>setLogForm(f=>({...f,notes:e.target.value}))} placeholder="Detail mein likhiye aaj ka kaam..."/>
                <Btn onClick={submitLog} disabled={submitting} variant="teal">{submitting?"Submitting...":"✅ Log Submit Karo"}</Btn>
              </div>
            </Card>

            {/* Recent Logs */}
            {logs.length>0&&(
              <div style={{marginTop:24}}>
                <SectionTitle sub="Pichle kaam ke records">Recent Logs</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {logs.slice(0,5).map(l=>(
                    <Card key={l.id} style={{padding:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.ink}}>{fmtD(l.log_date)}</div>
                        <Badge status={l.status} dict={ST}/>
                      </div>
                      <div style={{fontSize:12,color:C.ink2,marginBottom:4}}>👷 {l.workers_count} workers · {l.progress_percent}% complete</div>
                      {l.materials_used&&<div style={{fontSize:12,color:C.ink3,marginBottom:4}}>🧱 {l.materials_used}</div>}
                      <div style={{fontSize:12,color:C.ink3}}>{l.notes}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHOTOS */}
        {tab==="photos"&&(
          <div className="fu">
            <SectionTitle sub="Project ki photos upload karo">Photo Upload</SectionTitle>
            <Card style={{padding:24,maxWidth:600}}>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div>
                  <Label>Project Select Karo *</Label>
                  <select value={selProject?.id||""} onChange={e=>setSelProject(assignedProjects.find(p=>p.id===parseInt(e.target.value))||null)}
                    style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:C.sans,background:"#fff",outline:"none"}}>
                    <option value="">-- Project chuniye --</option>
                    {assignedProjects.map(p=><option key={p.id} value={p.id}>{p.scheme} — {p.village}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Photo Type</Label>
                  <div style={{display:"flex",gap:8}}>
                    {[["before","🟡 Before"],["during","🔵 During"],["after","🟢 After"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setPhotoForm(f=>({...f,photo_type:v}))}
                        style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${photoForm.photo_type===v?C.teal:C.border}`,background:photoForm.photo_type===v?`${C.teal}15`:"#fff",fontSize:12,cursor:"pointer",fontFamily:C.sans,color:photoForm.photo_type===v?C.teal:C.ink3,fontWeight:photoForm.photo_type===v?600:400}}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Photo Upload Karo *</Label>
                  <div style={{border:`2px dashed ${C.border}`,borderRadius:12,padding:20,textAlign:"center",cursor:"pointer",background:"#fafaf8"}}
                    onClick={()=>document.getElementById("photo-input").click()}>
                    {photoForm.preview?<img src={photoForm.preview} style={{maxWidth:"100%",maxHeight:200,borderRadius:8,objectFit:"cover"}} alt="preview"/>:
                      <div><div style={{fontSize:32,marginBottom:8}}>📷</div><div style={{fontSize:13,color:C.ink3}}>Tap karke photo chuniye</div></div>}
                  </div>
                  <input id="photo-input" type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>{const f=e.target.files[0];if(!f)return;setPhotoForm(pf=>({...pf,file:f,preview:URL.createObjectURL(f)}));}}/>
                </div>
                <Field label="Caption (kya dikh raha hai photo mein)" value={photoForm.caption} onChange={e=>setPhotoForm(f=>({...f,caption:e.target.value}))} placeholder="e.g. Foundation ka kaam shuru hua"/>
                <div>
                  <Label>GPS Location</Label>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <Btn sm variant="secondary" onClick={getLocation}>📍 Location Capture Karo</Btn>
                    {photoForm.lat&&<span style={{fontSize:11,fontFamily:C.mono,color:C.teal}}>✅ {photoForm.lat?.toFixed(4)}, {photoForm.lng?.toFixed(4)}</span>}
                  </div>
                </div>
                <Btn onClick={submitPhoto} disabled={submitting} variant="teal">{submitting?"Uploading...":"📤 Photo Upload Karo"}</Btn>
              </div>
            </Card>

            {/* Photo Gallery */}
            {photos.length>0&&(
              <div style={{marginTop:24}}>
                <SectionTitle sub="Tumhari uploaded photos">Photo Gallery</SectionTitle>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                  {photos.map(ph=>(
                    <Card key={ph.id} style={{overflow:"hidden"}}>
                      <img src={ph.photo_url} style={{width:"100%",height:140,objectFit:"cover"}} alt={ph.caption}/>
                      <div style={{padding:"10px 12px"}}>
                        <div style={{fontSize:11,fontFamily:C.mono,color:ph.photo_type==="before"?C.amber:ph.photo_type==="after"?C.green:C.blue,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{ph.photo_type}</div>
                        {ph.caption&&<div style={{fontSize:12,color:C.ink2}}>{ph.caption}</div>}
                        {ph.lat&&<div style={{fontSize:10,color:C.ink4,marginTop:4,fontFamily:C.mono}}>📍 {ph.lat?.toFixed(3)}, {ph.lng?.toFixed(3)}</div>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab==="notifs"&&(
          <div className="fu">
            <SectionTitle sub="Admin aur system se messages">Notifications</SectionTitle>
            {notifications.length===0?<Card style={{padding:24,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🔔</div><div style={{color:C.ink3}}>Koi notification nahi abhi</div></Card>:(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {notifications.map(n=>(
                  <Card key={n.id} style={{padding:16,background:n.read?"#fff":"#f0fdf4",borderLeft:`3px solid ${n.read?C.border:C.green}`,cursor:"pointer"}} onClick={()=>markRead(n.id)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13,color:C.ink,marginBottom:4}}>{n.title}</div>
                        <div style={{fontSize:12,color:C.ink3}}>{n.message}</div>
                        <div style={{fontSize:10,fontFamily:C.mono,color:C.ink4,marginTop:6}}>{fmtD(n.created_at?.split("T")[0])}</div>
                      </div>
                      {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:C.green,flexShrink:0,marginTop:4}}/>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
