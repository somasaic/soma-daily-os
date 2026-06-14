export const DEFAULT_SCHEDULES = {
  full: [
    { time:'5:00 AM',  label:'Wake + hydrate + 3-line journal',                type:'ritual'  },
    { time:'5:30 AM',  label:'Review today\'s plan (5 min)',                    type:'plan'    },
    { time:'6:00 AM',  label:'🔥 DEEP WORK BLOCK 1 — Tier 1 skill (2.5 hrs)',  type:'work'    },
    { time:'8:30 AM',  label:'Breakfast + short break',                         type:'break'   },
    { time:'9:00 AM',  label:'🔥 DEEP WORK BLOCK 2 — Tier 1/2 skill (2.5 hrs)',type:'work'    },
    { time:'11:30 AM', label:'Break + stretch',                                 type:'break'   },
    { time:'12:00 PM', label:'🔥 DEEP WORK BLOCK 3 — Tier 2 skill (1.5 hrs)',  type:'work'    },
    { time:'1:30 PM',  label:'Lunch + proper rest',                             type:'break'   },
    { time:'2:30 PM',  label:'🔥 DEEP WORK BLOCK 4 — Side skill / review',     type:'work'    },
    { time:'4:30 PM',  label:'Break',                                           type:'break'   },
    { time:'5:00 PM',  label:'📤 GitHub push + LinkedIn post (1 hr)',            type:'habit'   },
    { time:'6:00 PM',  label:'Exercise / walk outside (1 hr)',                  type:'health'  },
    { time:'7:00 PM',  label:'Dinner',                                          type:'break'   },
    { time:'8:00 PM',  label:'Concept review / tutorials (1.5 hrs)',            type:'review'  },
    { time:'9:30 PM',  label:'Plan tomorrow + quick journal',                   type:'plan'    },
    { time:'10:00 PM', label:'Wind down — no screens',                          type:'wind'    },
    { time:'11:00 PM', label:'😴 Sleep',                                        type:'sleep'   },
  ],
  exhausted: [
    { time:'5:00 AM',  label:'Slow wake — no pressure',                         type:'ritual'  },
    { time:'6:30 AM',  label:'Watch course videos only (passive)',               type:'review'  },
    { time:'8:30 AM',  label:'Breakfast + rest',                                type:'break'   },
    { time:'9:30 AM',  label:'ONE concept review only — max 1.5 hrs',           type:'work'    },
    { time:'11:00 AM', label:'Nap if needed — no guilt',                        type:'break'   },
    { time:'1:00 PM',  label:'Lunch',                                           type:'break'   },
    { time:'2:00 PM',  label:'📤 GitHub: 1 small commit',                        type:'habit'   },
    { time:'3:00 PM',  label:'LinkedIn: 1 post OR 3 comments',                  type:'habit'   },
    { time:'4:00 PM',  label:'Walk outside — medicine today',                   type:'health'  },
    { time:'5:00 PM',  label:'Rest / dinner prep',                              type:'break'   },
    { time:'7:00 PM',  label:'Light tutorial if energy allows',                 type:'review'  },
    { time:'9:00 PM',  label:'Plan tomorrow',                                   type:'plan'    },
    { time:'10:00 PM', label:'Wind down',                                       type:'wind'    },
    { time:'11:00 PM', label:'😴 Sleep — extra important today',                type:'sleep'   },
  ],
  gap: [
    { time:'Travel',       label:'Podcast/YouTube on skill topic',              type:'review'  },
    { time:'Free hour',    label:'1 concept note on phone',                     type:'work'    },
    { time:'Anytime',      label:'LinkedIn: engage 3 posts',                    type:'habit'   },
    { time:'Evening',      label:'📤 GitHub: push notes or 1 tiny commit',       type:'habit'   },
    { time:'Before sleep', label:'Set tomorrow\'s day type here',               type:'plan'    },
    { time:'11:00 PM',     label:'😴 Sleep — no guilt',                         type:'sleep'   },
  ],
  interview: [
    { time:'5:00 AM',       label:'Normal wake — light breakfast',              type:'ritual'  },
    { time:'6:00 AM',       label:'20 min exercise — calms nerves',             type:'health'  },
    { time:'7:00 AM',       label:'Review KEY concepts only — no new things',   type:'review'  },
    { time:'9:00 AM',       label:'Practice 5 behavioral questions (STAR)',     type:'work'    },
    { time:'10:00 AM',      label:'Rest — calm nervous system',                 type:'break'   },
    { time:'Pre-interview', label:'5-min breathing — you are prepared',         type:'ritual'  },
    { time:'🎯 INTERVIEW',  label:'Execute — listen, think aloud, clarify',     type:'work'    },
    { time:'Post-interview',label:'📝 30-min debrief: asked/wins/improve',       type:'plan'    },
    { time:'Evening',       label:'REST — you showed up',                       type:'break'   },
    { time:'Before sleep',  label:'📤 GitHub push + plan tomorrow',              type:'habit'   },
    { time:'11:00 PM',      label:'😴 Sleep — recovery IS preparation',         type:'sleep'   },
  ],
  rest: [
    { time:'No schedule', label:'No pressure — rest IS part of the process',   type:'ritual'  },
    { time:'Anytime',     label:'✅ GitHub: 1 commit (even smallest)',           type:'habit'   },
    { time:'Anytime',     label:'✅ LinkedIn: 1 comment',                        type:'habit'   },
    { time:'Anytime',     label:'✅ Plan tomorrow (5 min only)',                  type:'plan'    },
    { time:'By 11 PM',    label:'😴 8 hrs sleep — brain consolidates here',     type:'sleep'   },
  ],
}

export const DEFAULT_DAY_SCHEDULES = {
  Mon: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Gym & Workout (1 hour)',                               type:'health'     },
    { time:'7:00 AM',  label:'Freshen Up',                                           type:'ritual'     },
    { time:'8:00 AM',  label:'Job Hunting & Apply',                                  type:'work'       },
    { time:'10:00 AM', label:'Breakfast + Rest',                                     type:'break'      },
    { time:'11:00 AM', label:'🔥 PRIMARY LEARNING — Session + Practice + Q&A Notes', type:'work'       },
    { time:'1:30 PM',  label:'STAR Recording (record answers)',                      type:'review'     },
    { time:'3:00 PM',  label:'Secondary Skill study',                                type:'work'       },
    { time:'4:30 PM',  label:'Go Out (walk / fresh air)',                            type:'health'     },
    { time:'5:30 PM',  label:'Family / Friends / Personal',                          type:'relaxation' },
    { time:'7:00 PM',  label:'Review + Pending Notes',                               type:'review'     },
    { time:'9:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
  Tue: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Gym & Workout (1 hour)',                               type:'health'     },
    { time:'7:00 AM',  label:'Freshen Up',                                           type:'ritual'     },
    { time:'8:00 AM',  label:'Pramod Demo Session',                                  type:'work'       },
    { time:'9:30 AM',  label:'Temple',                                               type:'ritual'     },
    { time:'11:00 AM', label:'Breakfast',                                            type:'break'      },
    { time:'12:00 PM', label:'Job Hunting & Apply',                                  type:'work'       },
    { time:'2:00 PM',  label:'Quick Learning (tutorial / concept)',                  type:'review'     },
    { time:'4:00 PM',  label:'Go Out',                                               type:'health'     },
    { time:'6:00 PM',  label:'Review + Pending Notes',                               type:'review'     },
    { time:'9:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
  Wed: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Gym & Workout (1 hour)',                               type:'health'     },
    { time:'7:00 AM',  label:'Freshen Up',                                           type:'ritual'     },
    { time:'8:00 AM',  label:'Job Hunting & Apply',                                  type:'work'       },
    { time:'10:00 AM', label:'Breakfast + Rest',                                     type:'break'      },
    { time:'11:00 AM', label:'🔥 PRIMARY LEARNING — Session + Practice + Q&A Notes', type:'work'       },
    { time:'1:30 PM',  label:'STAR Recording (record answers)',                      type:'review'     },
    { time:'3:00 PM',  label:'Secondary Skill study',                                type:'work'       },
    { time:'4:30 PM',  label:'Go Out',                                               type:'health'     },
    { time:'5:30 PM',  label:'Family / Friends / Personal',                          type:'relaxation' },
    { time:'7:00 PM',  label:'Review + Pending Notes',                               type:'review'     },
    { time:'9:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
  Thu: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Gym & Workout (1 hour)',                               type:'health'     },
    { time:'7:00 AM',  label:'Freshen Up',                                           type:'ritual'     },
    { time:'8:00 AM',  label:'Pramod Demo Session',                                  type:'work'       },
    { time:'10:00 AM', label:'Job Hunting & Apply',                                  type:'work'       },
    { time:'12:00 PM', label:'Quick Learning (tutorial / concept)',                  type:'review'     },
    { time:'2:00 PM',  label:'Go Out',                                               type:'health'     },
    { time:'4:00 PM',  label:'Family / Friends / Personal',                          type:'relaxation' },
    { time:'6:00 PM',  label:'Review + Pending Notes',                               type:'review'     },
    { time:'9:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
  Fri: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Gym & Workout (1 hour)',                               type:'health'     },
    { time:'7:00 AM',  label:'Freshen Up',                                           type:'ritual'     },
    { time:'8:00 AM',  label:'Job Hunting & Apply',                                  type:'work'       },
    { time:'10:00 AM', label:'Breakfast + Rest',                                     type:'break'      },
    { time:'11:00 AM', label:'🔥 PRIMARY LEARNING — Session + Practice + Q&A Notes', type:'work'       },
    { time:'1:30 PM',  label:'STAR Recording (record answers)',                      type:'review'     },
    { time:'3:00 PM',  label:'Secondary Skill study',                                type:'work'       },
    { time:'4:30 PM',  label:'Go Out',                                               type:'health'     },
    { time:'5:30 PM',  label:'Family / Friends / Personal',                          type:'relaxation' },
    { time:'7:00 PM',  label:'Review + Pending Notes',                               type:'review'     },
    { time:'9:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
  Sat: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Gym & Workout (1 hour)',                               type:'health'     },
    { time:'7:00 AM',  label:'Freshen Up',                                           type:'ritual'     },
    { time:'8:00 AM',  label:'Pramod Demo Session',                                  type:'work'       },
    { time:'9:30 AM',  label:'Temple',                                               type:'ritual'     },
    { time:'11:00 AM', label:'Job Hunting & Apply',                                  type:'work'       },
    { time:'1:00 PM',  label:'3× AI BLUEPRINT SESSION',                              type:'work'       },
    { time:'4:00 PM',  label:'Learning Part (new concept / tutorial)',               type:'review'     },
    { time:'6:00 PM',  label:'Stop & Go Out',                                        type:'health'     },
    { time:'7:00 PM',  label:'Review + Pending Notes',                               type:'review'     },
    { time:'9:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
  Sun: [
    { time:'5:00 AM',  label:'Shower + Shiva Mantra (108 times)',                   type:'ritual'     },
    { time:'6:00 AM',  label:'Rest / Light Walk — No Gym, Recovery Day',             type:'health'     },
    { time:'8:00 AM',  label:'Personal Time',                                        type:'relaxation' },
    { time:'10:00 AM', label:'Job Hunting (Light)',                                  type:'work'       },
    { time:'12:00 PM', label:'3× AI BLUEPRINT SESSION',                              type:'work'       },
    { time:'3:00 PM',  label:'FREE FORM — anything you feel like doing',             type:'relaxation' },
    { time:'7:00 PM',  label:'Dinner → Wind down',                                   type:'wind'       },
    { time:'11:00 PM', label:'😴 Sleep',                                             type:'sleep'      },
  ],
}

export const BANNERS = {
  full:      { cls:'banner-full',      icon:'⚡', text:'Full Day — Maximum productivity. 3 deep work blocks. Execute.' },
  exhausted: { cls:'banner-exhausted', icon:'😮‍💨', text:'Exhausted Day — Lighter load. Passive learning + non-negotiables.' },
  gap:       { cls:'banner-gap',       icon:'✈️',  text:'Gap/Travel Day — Stay connected. Micro-learning + habits only.' },
  interview: { cls:'banner-interview', icon:'🎯', text:'Interview Day — You are ready. Trust your preparation. Execute.' },
  rest:      { cls:'banner-rest',      icon:'🌿', text:'Rest Day — Recovery is progress. Non-negotiables only, then sleep.' },
}

export const SCHED_TITLES = {
  full:'⚡ FULL DAY SCHEDULE — 5AM TO 11PM',
  exhausted:'😮‍💨 EXHAUSTED DAY SCHEDULE',
  gap:'✈️ GAP/TRAVEL — MICRO TASKS',
  interview:'🎯 INTERVIEW DAY SCHEDULE',
  rest:'🌿 REST DAY',
}

export const FOCUS_MAP = {
  full:      { name:'Playwright + TypeScript',  sub:'Tier 1 · Primary · 3 deep work blocks' },
  exhausted: { name:'Playwright (review only)', sub:'Tier 1 · Videos + recap only' },
  gap:       { name:'Mobile Learning',          sub:'Podcast/YouTube on current skill' },
  interview: { name:'Interview Prep Mode',      sub:'Behavioral + key concepts review' },
  rest:      { name:'Non-Negotiables Only',     sub:'GitHub + LinkedIn + Plan tomorrow' },
}

export const SKILLS_DATA = [
  { tier:'tier1', name:'TIER 1 — CRITICAL', color:'#ef4444', skills:[
    { id:'playwright',  name:'Playwright — Beginner to Advanced', note:'AI Blueprint 3x + Playwright Mastery (IN PROGRESS)', def:55 },
    { id:'typescript',  name:'TypeScript for UI Testing',         note:'Core language for modern Playwright frameworks',     def:40 },
  ]},
  { tier:'tier2', name:'TIER 2 — HIGH VALUE', color:'#f97316', skills:[
    { id:'api_playwright', name:'Playwright API Testing',     note:'API-level testing via Playwright',       def:20 },
    { id:'api_postman',    name:'API Testing with Postman',   note:'REST fundamentals + advanced scenarios', def:35 },
    { id:'api_contract',   name:'API Contract Testing',       note:'Pact framework, schema validation',      def:10 },
    { id:'api_strategy',   name:'API Testing Strategy',       note:'Production-level concepts, backend QA',  def:15 },
  ]},
  { tier:'tier3', name:'TIER 3 — EMPLOYABILITY', color:'#f59e0b', skills:[
    { id:'cicd_github', name:'CI/CD with GitHub Actions', note:'YAML workflows + test pipelines', def:30 },
    { id:'sql',         name:'SQL — Basics to Mid Level', note:'Queries, joins, backend QA',      def:25 },
    { id:'docker',      name:'Docker for QA Engineers',   note:'Containers, test environments',   def:15 },
    { id:'jenkins',     name:'Jenkins Pipelines',         note:'Classic CI/CD, widely used',      def:10 },
  ]},
  { tier:'tier4', name:'TIER 4 — DIFFERENTIATORS', color:'#6c47ff', skills:[
    { id:'ai_agents',   name:'AI Agents & Sub-agents',              note:'Building + testing AI agents',     def:30 },
    { id:'prompt_eng',  name:'Prompt Engineering',                   note:'Effective LLM prompting',         def:40 },
    { id:'llm_testing', name:'Testing LLMs Properly',                note:'Evaluation, hallucination detect', def:15 },
    { id:'selenium_ai', name:'Selenium → Playwright Migration (AI)', note:'AI-assisted migration',           def:10 },
  ]},
  { tier:'tier5', name:'TIER 5 — EDGE', color:'#22c55e', skills:[
    { id:'claude_code', name:'Claude Code for Automation',  note:'AI-powered frameworks',         def:35 },
    { id:'agile',       name:'Agile/Scrum/SAFe',           note:'Ceremonies, QA in Agile teams', def:45 },
    { id:'github_adv',  name:'GitHub Actions (Advanced)',   note:'Matrix, secrets, complex flows', def:20 },
  ]},
]

export const TIER_COLORS = {
  tier1:'#ef4444',
  tier2:'#f97316',
  tier3:'#f59e0b',
  tier4:'#6c47ff',
  tier5:'#22c55e',
}

export const DEFAULT_NON_NEG = [
  { id:'github',   label:'📤 Push to GitHub (even 1 commit — no matter what)' },
  { id:'linkedin', label:'💼 LinkedIn: 1 post OR 3 meaningful comments' },
  { id:'plan',     label:'🗓️ Plan tomorrow (5 min max)' },
]

export const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export const DEFAULT_WEEK_PLAN = {
  Mon:{ type:'full',      skill:'Playwright + TypeScript (Deep Work)' },
  Tue:{ type:'full',      skill:'API Testing — Playwright + Postman' },
  Wed:{ type:'full',      skill:'TypeScript + CI/CD GitHub Actions' },
  Thu:{ type:'full',      skill:'API Contract Testing + Strategy' },
  Fri:{ type:'full',      skill:'SQL basics + Docker intro' },
  Sat:{ type:'exhausted', skill:'Review week progress + LinkedIn posts' },
  Sun:{ type:'rest',      skill:'Rest + plan next week' },
}

export const NOTE_TYPES = [
  { id:'all',       label:'All',          color:'#5a6080', bg:'#f0f2f8'  },
  { id:'recruiter', label:'📞 Recruiter', color:'#2563eb', bg:'#dbeafe'  },
  { id:'interview', label:'🎯 Interview', color:'#dc2626', bg:'#fee2e2'  },
  { id:'learning',  label:'📚 Learning',  color:'#5b21b6', bg:'#ede9ff'  },
  { id:'idea',      label:'💡 Idea',      color:'#d97706', bg:'#fef3c7'  },
  { id:'followup',  label:'⚠️ Follow-up', color:'#c2410c', bg:'#ffedd5'  },
  { id:'interrupt', label:'⚡ Interrupt', color:'#be185d', bg:'#fce7f3'  },
  { id:'general',   label:'📝 General',   color:'#475569', bg:'#f1f5f9'  },
]

export const PIPELINE_STAGES = [
  { id:'all',       label:'All' },
  { id:'applied',   label:'Applied',    cls:'jc-applied',   color:'#3b82f6' },
  { id:'screened',  label:'Screened',   cls:'jc-screened',  color:'#f59e0b' },
  { id:'round1',    label:'Round 1',    cls:'jc-round1',    color:'#6c47ff' },
  { id:'round2',    label:'Round 2',    cls:'jc-round2',    color:'#8b5cf6' },
  { id:'offer',     label:'Offer ✅',   cls:'jc-offer',     color:'#22c55e' },
  { id:'rejected',  label:'Rejected',   cls:'jc-rejected',  color:'#ef4444' },
  { id:'withdrawn', label:'Withdrawn',  cls:'jc-withdrawn', color:'#6b7280' },
]

export const KANBAN_COLUMNS = PIPELINE_STAGES.filter(s => s.id !== 'all')

export const HUNT_DAY_CFG = {
  0: { mode:'OUTREACH MODE',   cls:'hunt-out',  icon:'🌐', desc:'LinkedIn posts, recruiter connects, profile polish.' },
  1: { mode:'SELECTIVE APPLY', cls:'hunt-mon',  icon:'🎯', desc:'Apply 80%+ matches only. Clear ALL follow-ups first.' },
  2: { mode:'APPLY HARD',      cls:'hunt-hard', icon:'🚀', desc:'Every 75%+ listing. Active follow-ups mandatory.' },
  3: { mode:'APPLY HARD',      cls:'hunt-hard', icon:'🚀', desc:'Apply + follow up all active conversations.' },
  4: { mode:'APPLY HARD',      cls:'hunt-hard', icon:'🚀', desc:'Final push. Close every open loop.' },
  5: { mode:'OUTREACH MODE',   cls:'hunt-out',  icon:'🤝', desc:'LinkedIn FUs, recruiter connects, profile activity.' },
  6: { mode:'BUILD & CONNECT', cls:'hunt-out',  icon:'📝', desc:'Posts, profile updates, recruiter network building.' },
}

export const HUNT_STATUS_MAP = {
  applied:       { label:'Applied',          cls:'hs-applied'   },
  screening:     { label:'Awaiting Reply',   cls:'hs-screening' },
  interview:     { label:'Interview',        cls:'hs-interview' },
  consideration: { label:'In Consideration', cls:'hs-consider'  },
  close:         { label:'Near Close',       cls:'hs-close'     },
  rejected:      { label:'Rejected',         cls:'hs-rejected'  },
  stale:         { label:'Stale',            cls:'hs-stale'     },
  closed:        { label:'Closed',           cls:'hs-closed'    },
}

export const HUNT_GROUPS = [
  { key:'hot',     label:'HOT — Interviews & Active', cls:'hg-hot',     statuses:['interview','consideration','close','screening'] },
  { key:'applied', label:'APPLIED / PENDING',         cls:'hg-applied', statuses:['applied']           },
  { key:'stale',   label:'STALE — Consider Closing',  cls:'hg-stale',   statuses:['stale']             },
  { key:'closed',  label:'CLOSED / REJECTED',         cls:'hg-closed',  statuses:['rejected','closed'] },
]

export const STAR_CATEGORIES = [
  { id:'behavioral',   label:'Behavioral' },
  { id:'technical',    label:'Technical'  },
  { id:'leadership',   label:'Leadership' },
  { id:'conflict',     label:'Conflict'   },
  { id:'achievement',  label:'Achievement'},
]

export const HUNT_SEED = [
  { id:'nutanix-automation-blr-20260525', company:'Nutanix (Diversity Nexus)', role:'Automation Engineer', location:'Bangalore - Hybrid', appliedDate:'2026-05-25', status:'applied', followupDate:'2026-06-01', contact:'Sumanth', channel:'Email / Recruiter', source:'', match:'', notes:'Via recruiter Sumanth (Telugu, Diversity Nexus). Updated resume with K8s + Network Automation + LLMs. 30% hike mentioned' },
  { id:'certa-sdet-wf-20260504', company:'Certa', role:'SDET (Software Dev Engineer in Test)', location:'Remote - India', appliedDate:'2026-05-04', status:'screening', followupDate:'2026-05-04', contact:'Vibha M', channel:'Wellfound / Email', source:'', match:'', notes:'CODERBYTE TEST — complete if not done! Applied Wellfound. SDET II. 20-25L Remote. TypeScript+Playwright+AWS.' },
  { id:'ust-tester3-ref-20260504', company:'UST (Tester III)', role:'Tester III', location:'', appliedDate:'2026-05-04', status:'consideration', followupDate:'2026-05-11', contact:'Cousin referral', channel:'Internal referral', source:'', match:'', notes:'Auto-considered. Cousin referral. UST global IT services.' },
  { id:'resillion-qa-20260428', company:'Resillion', role:'QA / Test Automation', location:'', appliedDate:'2026-04-28', status:'screening', followupDate:'2026-05-01', contact:'Dhinesh Raj', channel:'LinkedIn', source:'', match:'', notes:'LinkedIn recruiter connect. Resume sent Apr 28. 15-min call pending' },
  { id:'scriptassistuk-qa-20260317', company:'Script Assist UK', role:'QA Automation Playwright TS', location:'Remote', appliedDate:'2026-03-17', status:'interview', followupDate:'2026-05-01', contact:'Ben Hamburger (CEO)', channel:'LinkedIn DM', source:'', match:'', notes:'CEO (Ben) interview Apr 17. FU sent Apr 27. No response yet. Final check' },
  { id:'capgemini-qa-20260322', company:'Capgemini', role:'Playwright Automation', location:'Bengaluru', appliedDate:'2026-03-22', status:'interview', followupDate:'2026-04-21', contact:'Prajakta B. Rajput', channel:'LinkedIn DM', source:'', match:'', notes:'Interview Apr 14. Thank you sent Apr 18. Follow up Prajakta NOW' },
  { id:'infineon-qa-20260322', company:'Infineon Technologies', role:'QA Automation', location:'Bengaluru', appliedDate:'2026-03-22', status:'close', followupDate:'2026-04-23', contact:'Anand N. Rawal', channel:'LinkedIn', source:'', match:'', notes:'Interview Apr 7. Final FU Apr 18. Close deadline PASSED - send final close msg NOW' },
  { id:'hackerrank-sdet-i-blr-20260525', company:'HackerRank', role:'SDET I', location:'Bengaluru - Hybrid', appliedDate:'2026-05-25', status:'screening', followupDate:'2026-05-27', contact:'HackerRank Hiring Team', channel:'Email (Chakra AI)', source:'', match:'', notes:'🔥 AI VOICE INTERVIEW RECEIVED May 25. Complete Chakra AI assessment.' },
  { id:'ibm-qa-auto-20260512', company:'IBM', role:'Quality Engineer - Automation', location:'India', appliedDate:'2026-05-12', status:'screening', followupDate:'2026-05-26', contact:'', channel:'IBM Careers', source:'', match:'', notes:'Coding assessment DONE May 14. Waiting for next step.' },
  { id:'deloitte-dec-qa-blr-20260525', company:'Deloitte (DEC)', role:'Sr. Executive - Test Automation', location:'Bangalore - Hybrid', appliedDate:'2026-05-25', status:'applied', followupDate:'2026-06-01', contact:'Rakshitha SM', channel:'LinkedIn DM', source:'', match:'', notes:'Applied May 25 via LinkedIn. Digital Excellence Centre team.' },
  { id:'groww-set2-blr-20260512', company:'Groww', role:'Software Engineer in Test II', location:'Bengaluru - Onsite', appliedDate:'2026-05-12', status:'applied', followupDate:'2026-05-19', contact:'', channel:'LinkedIn', source:'', match:'', notes:'Applied May 12. Major fintech/wealthtech unicorn.' },
  { id:'experian-sdet-hyd-20260525', company:'Experian', role:'SDET', location:'Hyderabad - Onsite', appliedDate:'2026-05-25', status:'applied', followupDate:'2026-06-01', contact:'', channel:'Indeed', source:'', match:'', notes:'Applied May 25 via Indeed. 88% match. Playwright+CI/CD+API Testing.' },
  { id:'browserstack-sdet-20260309', company:'BrowserStack', role:'SDET Playwright', location:'Bengaluru', appliedDate:'2026-03-09', status:'stale', followupDate:'2026-03-14', contact:'', channel:'', source:'', match:'', notes:'70+ days. Consider closing' },
  { id:'lambdatest-qa-20260309', company:'LambdaTest', role:'QA Automation', location:'', appliedDate:'2026-03-09', status:'stale', followupDate:'2026-03-14', contact:'', channel:'', source:'', match:'', notes:'70+ days. Consider closing' },
  { id:'headout-set-li-20260504', company:'Headout', role:'Software Engineer in Test', location:'Bengaluru', appliedDate:'2026-05-04', status:'rejected', followupDate:'2026-05-13', contact:'', channel:'', source:'', match:'', notes:'REJECTED May 13. Can reapply after 1 year.' },
  { id:'itron-qa-blr-20260512', company:'Itron, Inc.', role:'Software QA Engineer', location:'Bengaluru - Onsite', appliedDate:'2026-05-12', status:'rejected', followupDate:'2026-05-19', contact:'', channel:'LinkedIn', source:'', match:'', notes:'REJECTED May 13 via Workday email. Closed.' },
  { id:'bread-financial-pae-sdet-blr-20260601', company:'Bread Financial', role:'Platform Automation Engineer (SDET)', location:'Bengaluru, Karnataka', appliedDate:'2026-06-01', status:'applied', followupDate:'', contact:'', channel:'Indeed', source:'Indeed', match:'80', notes:'Applied Jun 1. Major US fintech (credit/BNPL) BLR office.' },
  { id:'clueso-founding-sdet-blr-20260601', company:'Clueso (YC W23)', role:'Founding SDET', location:'Bengaluru, Karnataka', appliedDate:'2026-06-01', status:'applied', followupDate:'', contact:'', channel:'Indeed', source:'Indeed', match:'80', notes:'Applied Jun 1. YC W23 AI product startup. First SDET hire.' },
]
