'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Plus, X, AlertTriangle, CheckCircle2, Clock, Trash2, Search, Filter, Eye, TrendingUp, RefreshCw, Link2 } from 'lucide-react';
import { PostModal } from './post-modal';
import { StatCard } from './stat-card';
import { PostCard } from './post-card';

// Real campaign list pulled directly from the Master Marketing Plan (July–Sept 2026)
export const ENTITIES = {
  'Eye World': {
    color: '#1D4ED8', dark: '#12308A',
    budget: '8,500 EGP/month', cplTarget: '≤ 200 EGP (Meta) · ≤ 400 EGP (Google)', leadTarget: '17–20 leads/month (LASIK)',
    campaigns: [
      { name: 'TransPRK — Monopoly Campaign', phase: 'Phase 1', hook: 'الألماني الوحيد — TransPRK بدون شريحة، بدون مشرط' },
      { name: 'Branding Campaign — دنيا العيون', phase: 'Phase 1', hook: 'دنيا العيون — حيث التخصص يلتقي بالثقة' },
      { name: 'LASIK Campaign — يوليو', phase: 'Phase 1', hook: 'استيقظ وشوف بدون نضارة — LASIK في Eye World (بدائل: كسر النضارة · لاعب مش متمكن من الكورة بسبب النضارة · إجازة يلا نعمل ليزك)' },
      { name: 'Gulf Campaign — مرضى الخليج', phase: 'Phase 2', hook: 'سافر لمصر وارجع بعيون جديدة' },
      { name: 'Pediatric Eye Screening — أمراض العيون عند الأطفال', phase: 'Phase 1', hook: 'الكشف المبكر لحديثي الولادة وأطفال الحضانة — حول مفاجئ أو بريق أبيض في العين (Retinoblastoma, Congenital Cataract/Glaucoma, Ptosis, Strabismus)', medicalReview: true },
      { name: 'Summer Eye Care — أمراض العيون المرتبطة بالصيف', phase: 'Phase 1', hook: 'جفاف العين من التكييف والحرارة، التهاب الملتحمة بعد حمام السباحة، ظفرة العين — اكشف بمجرد ظهور الأعراض', medicalReview: true },
      { name: 'Warning Signs Campaign — علامات تستوجب الكشف الفوري', phase: 'Phase 1', hook: 'ذباب طائر أو ومضات ضوئية، فقدان الرؤية المركزية، رؤية متموجة، رؤية نفقية، ضبابية عامة — كل علامة لها سبب يستحق كشف فوري', medicalReview: true },
    ],
  },
  'Top Care Derma': {
    color: '#0D9488', dark: '#08615A',
    budget: '9,500 EGP/month (shared w/ Dental)', cplTarget: '≤ 80–150 EGP', leadTarget: '60–80 leads/month',
    campaigns: [
      { name: 'بهاق — وحدة البهاق المتخصصة', phase: 'Phase 1', hook: 'قبل ما تشوف البهاق... شوف الإنسان' },
      { name: 'Mediostar — إزالة الشعر', phase: 'Phase 3', hook: 'جلسات تحت إشراف طبيب جلدية — مش مجرد تقنية' },
      { name: 'StarWalker — تاتو، كلف، نمش', phase: 'Phase 1', hook: 'إزالة التاتو والكلف بأمان — Fotona StarWalker' },
      { name: 'Vivace RF — كولاجين وكونتورينج', phase: 'Phase 1', hook: 'بديل الليفت بدون جراحة — Vivace RF' },
      { name: 'HydraFacial + Oxygen — بشرة زجاجية', phase: 'Phase 1', hook: 'بشرة زجاجية في جلسة واحدة' },
      { name: 'بوتوكس + فيلر + Skin Boosters', phase: 'Phase 3', hook: 'وجهك يستحق خطة — مش عرض لمدة محدودة' },
      { name: 'TikTok Launch — Top Care Derma', phase: 'Phase 2', hook: 'First Mover على TikTok في الدقي' },
    ],
  },
  'Top Care Dental': {
    color: '#B8860B', dark: '#8A6608',
    budget: '9,500 EGP/month (shared w/ Derma)', cplTarget: '≤ 150 EGP', leadTarget: '15–25 leads/month',
    campaigns: [
      { name: 'Hollywood Smile — ابتسامة هوليوود', phase: 'Phase 1', hook: 'ابتسامتك تستاهل أحسن من كده' },
      { name: 'تنظيف جير + حشو + خلع — Social Offer', phase: 'Phase 1', hook: 'صحة أسنانك = صحة جسمك كله' },
      { name: 'Dental under GA — أطفال', phase: 'Phase 1', hook: 'طفلك خايف من الدكتور؟ — الحل موجود' },
    ],
  },
  'Dr. Ihab': {
    color: '#7C3AED', dark: '#4E1FA3',
    budget: '2,500 EGP/month', cplTarget: 'Measured by Gulf patients, not CPL', leadTarget: '5–10 Gulf leads/month · +10K followers/3mo',
    campaigns: [
      { name: 'Instagram Authority — Weekly', phase: 'Phase 1', hook: 'Personal brand authority content' },
      { name: 'Snapchat Daily Stories', phase: 'Phase 1', hook: 'Daily behind-the-scenes activation' },
      { name: 'Podcast / YouTube', phase: 'Phase 2', hook: 'رحلة نجاح — episode content' },
      { name: 'Gulf Personal Brand (Paid Boost)', phase: 'Phase 2', hook: 'نفس التقنية الموجودة في لندن ودبي' },
    ],
  },
};

export const PHASES = ['Phase 1 — Authority Build (July)', 'Phase 2 — Expansion (August)', 'Phase 3 — Peak Season (September)'];
export const phaseLabel = (short: string) => PHASES.find(p => p.startsWith(short)) || PHASES[0];

export const AD_ACCOUNTS = {
  'Eye World': 'act_732470941212981',
  'Top Care Derma': 'act_1451078790397836',
  'Top Care Dental': 'act_1451078790397836',
  'Dr. Ihab': 'act_1321668029881172',
};

export const FUNNEL = ['TOFU', 'MOFU', 'BOFU', 'Retention'];
export const CHANNELS = ['Instagram', 'Snapchat', 'TikTok', 'YouTube', 'Google', 'WhatsApp', 'Facebook'];
export const FORMATS = ['Reel', 'Static', 'Carousel', 'Story', 'Podcast', 'Ad'];
export const CTAS = ['WhatsApp', 'Call', 'DM'];
export const EDA_STATUSES = ['Not required (Standard)', 'Pending Dr. Ihab review', 'Approved', 'Rejected'];
export const WORKFLOW = ['Draft', 'Pending Design', 'Pending Compliance', 'Approved', 'Scheduled', 'Published'];
export const OWNERS = ['Hamdi', 'Bakr', 'Asmaa'];
export const LANGS = ['Arabic', 'English', 'Bilingual'];

export const WORKFLOW_COLOR = {
  'Draft': '#7a7f96',
  'Pending Design': '#f5a623',
  'Pending Compliance': '#f06363',
  'Approved': '#4f8ef7',
  'Scheduled': '#a78bfa',
  'Published': '#52d68a'
};

export const blank = () => ({
  id: 'post_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
  entity: 'Eye World',
  campaign: '',
  phase: 'Phase 1 — Authority Build (July)',
  funnelStage: 'TOFU',
  channel: 'Instagram',
  format: 'Reel',
  publishDate: '',
  publishTime: '',
  hook: '',
  copy: '',
  assetUrl: '',
  priceText: '',
  ctaType: 'WhatsApp',
  edaStatus: 'Not required (Standard)',
  workflowStatus: 'Draft',
  owner: 'Hamdi',
  faceCheck: false,
  language: 'Arabic',
  reach: '',
  engagement: '',
  leads: '',
});

export function validate(post: any) {
  const errors = [];
  const fullText = (post.hook + ' ' + post.copy + ' ' + post.priceText);
  if (fullText.includes('التقسيط')) errors.push('Contains banned word "التقسيط" — use "الدفع على 6 شهور" or "ادفع براحتك" instead.');
  if (post.priceText.trim() && post.funnelStage !== 'BOFU') errors.push('Price/offer text is only allowed when Funnel Stage = BOFU.');
  if (post.entity.startsWith('Top Care') && post.entity !== 'Top Care Dental' && /خصم|discount|offer %/i.test(fullText)) errors.push('Discount language is forbidden on Top Care Derma creatives (Dental social offers are the exception — plan section 4).');
  if (post.entity === 'Dr. Ihab' && !post.faceCheck) errors.push('Dr. Ihab face-visibility check must be confirmed before this can be approved.');
  if (!post.publishDate) errors.push('Publish date is required.');
  return errors;
}

export function needsMedicalReview(post: any) {
  const text = (post.hook + ' ' + post.copy).toLowerCase();
  return /نتيجة|علاج|شفاء|ضمان|result|cure|guarantee|% نجاح/i.test(text);
}

export function actionBucket(post: any) {
  if (post.edaStatus === 'Pending Dr. Ihab review') return 'review';
  if (['Approved', 'Scheduled', 'Published'].includes(post.workflowStatus)) return 'publish';
  return 'prepare';
}

export const BUCKET_META = {
  publish: { label: '🟢 جاهزة للنشر', color: '#52d68a', fill: 'rgba(82,214,138,0.12)' },
  prepare: { label: '🟡 محتاجة تحضير', color: '#f5a623', fill: 'rgba(245,166,35,0.12)' },
  review: { label: '🔴 محتاجة مراجعتك', color: '#f06363', fill: 'rgba(240,99,99,0.12)' },
};

const SEED_POSTS = [
  // Week 1
  { entity: 'Eye World', campaign: 'TransPRK — Monopoly Campaign', publishDate: '2026-07-05', workflowStatus: 'Approved', owner: 'Hamdi' },
  { entity: 'Eye World', campaign: 'Pediatric Eye Screening — أمراض العيون عند الأطفال', publishDate: '2026-07-09', workflowStatus: 'Draft', edaStatus: 'Pending Dr. Ihab review', owner: 'Hamdi' },
  { entity: 'Top Care Derma', campaign: 'بهاق — وحدة البهاق المتخصصة', publishDate: '2026-07-06', workflowStatus: 'Approved', owner: 'Bakr' },
  { entity: 'Top Care Dental', campaign: 'Hollywood Smile — ابتسامة هوليوود', publishDate: '2026-07-08', workflowStatus: 'Pending Design', owner: 'Bakr' },
  // Week 2
  { entity: 'Eye World', campaign: 'Branding Campaign — دنيا العيون', publishDate: '2026-07-12', workflowStatus: 'Approved', owner: 'Hamdi' },
  { entity: 'Eye World', campaign: 'Summer Eye Care — أمراض العيون المرتبطة بالصيف', publishDate: '2026-07-16', workflowStatus: 'Draft', edaStatus: 'Pending Dr. Ihab review', owner: 'Hamdi' },
  { entity: 'Top Care Derma', campaign: 'StarWalker — تاتو، كلف، نمش', publishDate: '2026-07-13', workflowStatus: 'Approved', owner: 'Bakr' },
  { entity: 'Top Care Derma', campaign: 'Vivace RF — كولاجين وكونتورينج', publishDate: '2026-07-16', workflowStatus: 'Pending Design', owner: 'Bakr' },
  { entity: 'Top Care Dental', campaign: 'Hollywood Smile — ابتسامة هوليوود', publishDate: '2026-07-14', workflowStatus: 'Approved', owner: 'Bakr' },
  { entity: 'Top Care Dental', campaign: 'تنظيف جير + حشو + خلع — Social Offer', publishDate: '2026-07-16', workflowStatus: 'Pending Design', owner: 'Bakr' },
];

export function CampaignCommandCenter() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterEntity, setFilterEntity] = useState('All');
  const [filterOwner, setFilterOwner] = useState('All');
  const [search, setSearch] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const initPosts = () => {
      try {
        const stored = localStorage.getItem('campaign-posts');
        if (stored) {
          return JSON.parse(stored);
        } else {
          const seeded = SEED_POSTS.map((s, i) => ({
            ...blank(),
            ...s,
            id: 'seed_' + i + '_' + Date.now(),
          }));
          // Save seed data to localStorage
          localStorage.setItem('campaign-posts', JSON.stringify(seeded));
          return seeded;
        }
      } catch (e) {
        console.error('Failed to load posts:', e);
        return [];
      }
    };
    
    const initialPosts = initPosts();
    setPosts(initialPosts);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('campaign-posts', JSON.stringify(posts));
      setSaveError('');
    } catch (e) {
      setSaveError('Could not save — check connection.');
    }
  }, [posts, loaded]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (filterEntity !== 'All' && p.entity !== filterEntity) return false;
      if (filterOwner !== 'All' && p.owner !== filterOwner) return false;
      if (search && !(p.hook + p.copy + p.campaign).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, filterEntity, filterOwner, search]);

  const byDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    filtered.forEach(p => {
      const d = p.publishDate || 'No date';
      if (!map[d]) map[d] = [];
      map[d].push(p);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const pendingEDA = posts.filter(p => p.edaStatus === 'Pending Dr. Ihab review').length;
  const scheduled = posts.filter(p => p.workflowStatus === 'Scheduled').length;
  const published = posts.filter(p => p.workflowStatus === 'Published').length;

  const savePost = (post: any) => {
    setPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      return exists ? prev.map(p => p.id === post.id ? post : p) : [...prev, post];
    });
    setEditing(null);
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#0d0f14', color: '#e8eaf0', minHeight: '100vh', padding: '24px' }}>
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea { font-family: inherit; }
        ::placeholder { color: #7a7f96; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#2EC4A9', fontWeight: 600, marginBottom: 6 }}>90-Day Campaign · Eye World Group</div>
            <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Campaign Command Center</h1>
          </div>
          <button onClick={() => setEditing(blank())} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2EC4A9', color: '#04080F', border: 'none', borderRadius: 10, padding: '12px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            <Plus size={18} /> New Post
          </button>
        </div>

        {saveError && <div style={{ background: 'rgba(240,99,99,0.12)', color: '#f06363', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{saveError}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
          <StatCard label="Total Posts" value={posts.length} color="#4f8ef7" />
          <StatCard label="Pending Dr. Ihab" value={pendingEDA} color="#f06363" icon={pendingEDA > 0 ? <AlertTriangle size={16} /> : null} />
          <StatCard label="Scheduled" value={scheduled} color="#a78bfa" />
          <StatCard label="Published" value={published} color="#52d68a" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 16 }}>
          {Object.entries(ENTITIES).map(([name, e]) => (
            <div key={name} style={{ background: '#141720', border: `1px solid ${e.color}33`, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: e.color, marginBottom: 3 }}>{name}</div>
              <div style={{ fontSize: 11, color: '#7a7f96' }}>{e.budget} · CPL {e.cplTarget}</div>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        <div style={{ background: '#141720', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Calendar size={18} /> Publishing Calendar
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '8px 12px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
            />
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              style={{ padding: '8px 12px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
            >
              <option value="All">All Entities</option>
              {Object.keys(ENTITIES).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              style={{ padding: '8px 12px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
            >
              <option value="All">All Owners</option>
              {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {byDate.map(([date, datePosts]) => (
            <div key={date} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7a7f96', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {date}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {datePosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={setEditing}
                    onDelete={deletePost}
                  />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a7f96' }}>
              <p style={{ fontSize: 14 }}>No posts found. Try adjusting your filters or create a new post.</p>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <PostModal
          post={editing}
          onSave={savePost}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
