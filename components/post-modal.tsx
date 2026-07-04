import { X } from 'lucide-react';
import { ENTITIES, PHASES, FUNNEL, CHANNELS, FORMATS, CTAS, EDA_STATUSES, WORKFLOW, OWNERS, LANGS, validate, needsMedicalReview } from './campaign-command-center';

interface PostModalProps {
  post: any;
  onSave: (post: any) => void;
  onClose: () => void;
}

export function PostModal({ post, onSave, onClose }: PostModalProps) {
  const errors = validate(post);
  const needsMedical = needsMedicalReview(post);
  const entity = ENTITIES[post.entity as keyof typeof ENTITIES];
  const campaigns = entity ? entity.campaigns.map(c => c.name) : [];

  const handleChange = (key: string, value: any) => {
    onSave({ ...post, [key]: value });
  };

  const handleSaveClick = () => {
    if (errors.length === 0) {
      onSave(post);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#141720',
          borderRadius: 14,
          padding: 24,
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          width: '100%',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {post.id?.startsWith('post_') ? 'New Post' : 'Edit Post'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#7a7f96', cursor: 'pointer', fontSize: 24 }}
          >
            <X size={20} />
          </button>
        </div>

        {errors.length > 0 && (
          <div style={{ background: 'rgba(240,99,99,0.12)', border: '1px solid #f06363', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f06363', marginBottom: 6 }}>Errors:</div>
            {errors.map((err, i) => (
              <div key={i} style={{ fontSize: 11, color: '#f06363', marginBottom: 4 }}>
                • {err}
              </div>
            ))}
          </div>
        )}

        {needsMedical && (
          <div style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid #f5a623', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f5a623', marginBottom: 6 }}>⚠️ Medical Review Suggested</div>
            <div style={{ fontSize: 11, color: '#f5a623' }}>This post contains medical claims that may require Dr. Ihab&apos;s review.</div>
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {/* Entity & Campaign */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Entity</label>
              <select
                value={post.entity}
                onChange={(e) => handleChange('entity', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {Object.keys(ENTITIES).map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Campaign</label>
              <select
                value={post.campaign}
                onChange={(e) => handleChange('campaign', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                <option value="">Select a campaign...</option>
                {campaigns.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Phase & Funnel Stage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Phase</label>
              <select
                value={post.phase}
                onChange={(e) => handleChange('phase', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {PHASES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Funnel Stage</label>
              <select
                value={post.funnelStage}
                onChange={(e) => handleChange('funnelStage', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {FUNNEL.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Channel & Format */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Channel</label>
              <select
                value={post.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {CHANNELS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Format</label>
              <select
                value={post.format}
                onChange={(e) => handleChange('format', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {FORMATS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Publish Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Publish Date *</label>
              <input
                type="date"
                value={post.publishDate}
                onChange={(e) => handleChange('publishDate', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Publish Time</label>
              <input
                type="time"
                value={post.publishTime}
                onChange={(e) => handleChange('publishTime', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
          </div>

          {/* Hook */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Hook</label>
            <textarea
              value={post.hook}
              onChange={(e) => handleChange('hook', e.target.value)}
              placeholder="Main hook/headline for the post"
              style={{ width: '100%', padding: '10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13, minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          {/* Copy */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Copy</label>
            <textarea
              value={post.copy}
              onChange={(e) => handleChange('copy', e.target.value)}
              placeholder="Additional copy text"
              style={{ width: '100%', padding: '10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13, minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          {/* Asset URL & Price Text */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Asset URL</label>
              <input
                type="text"
                value={post.assetUrl}
                onChange={(e) => handleChange('assetUrl', e.target.value)}
                placeholder="Link to design/asset"
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Price Text</label>
              <input
                type="text"
                value={post.priceText}
                onChange={(e) => handleChange('priceText', e.target.value)}
                placeholder="Only for BOFU"
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
          </div>

          {/* CTA Type & Owner */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>CTA Type</label>
              <select
                value={post.ctaType}
                onChange={(e) => handleChange('ctaType', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {CTAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Owner</label>
              <select
                value={post.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {OWNERS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Language & EDA Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Language</label>
              <select
                value={post.language}
                onChange={(e) => handleChange('language', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>EDA Status</label>
              <select
                value={post.edaStatus}
                onChange={(e) => handleChange('edaStatus', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {EDA_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Workflow & Face Check */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Workflow Status</label>
              <select
                value={post.workflowStatus}
                onChange={(e) => handleChange('workflowStatus', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              >
                {WORKFLOW.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            {post.entity === 'Dr. Ihab' && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#a8afc0', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={post.faceCheck}
                    onChange={(e) => handleChange('faceCheck', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Face visibility checked
                </label>
              </div>
            )}
          </div>

          {/* Reach, Engagement, Leads */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Reach</label>
              <input
                type="text"
                value={post.reach}
                onChange={(e) => handleChange('reach', e.target.value)}
                placeholder="e.g., 5,000"
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Engagement</label>
              <input
                type="text"
                value={post.engagement}
                onChange={(e) => handleChange('engagement', e.target.value)}
                placeholder="e.g., 250"
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7a7f96', marginBottom: 4, textTransform: 'uppercase' }}>Leads</label>
              <input
                type="text"
                value={post.leads}
                onChange={(e) => handleChange('leads', e.target.value)}
                placeholder="e.g., 12"
                style={{ width: '100%', padding: '8px 10px', background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#e8eaf0', fontSize: 13 }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          disabled={errors.length > 0}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '12px 16px',
            background: errors.length > 0 ? '#7a7f96' : '#2EC4A9',
            color: errors.length > 0 ? '#0d0f14' : '#04080F',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
            opacity: errors.length > 0 ? 0.5 : 1
          }}
        >
          {errors.length > 0 ? 'Fix Errors Before Saving' : 'Save Post'}
        </button>
      </div>
    </div>
  );
}
