import { Eye, Trash2 } from 'lucide-react';
import { ENTITIES, WORKFLOW_COLOR, actionBucket, BUCKET_META } from './campaign-command-center';

interface PostCardProps {
  post: any;
  onEdit: (post: any) => void;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const entity = ENTITIES[post.entity as keyof typeof ENTITIES] || {};
  const bucket = actionBucket(post);
  const bucketMeta = BUCKET_META[bucket as keyof typeof BUCKET_META];

  return (
    <div
      style={{
        background: '#1a1f2e',
        border: `1px solid ${entity.color}44`,
        borderRadius: 10,
        padding: 14,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = entity.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${entity.color}22`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${entity.color}44`;
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: entity.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
            {post.entity}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0', marginBottom: 4 }}>
            {post.campaign || '(No campaign selected)'}
          </div>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          style={{ background: 'none', border: 'none', color: '#7a7f96', cursor: 'pointer', padding: 0 }}
          title="Delete post"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {post.hook && (
        <div style={{ fontSize: 12, color: '#a8afc0', marginBottom: 10, lineHeight: 1.4, maxHeight: 60, overflow: 'hidden' }}>
          {post.hook}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontSize: 10, background: '#2EC4A933', color: '#2EC4A9', padding: '3px 8px', borderRadius: 4 }}>
          {post.channel}
        </span>
        <span style={{ fontSize: 10, background: '#4f8ef733', color: '#4f8ef7', padding: '3px 8px', borderRadius: 4 }}>
          {post.format}
        </span>
        {post.funnelStage && (
          <span style={{ fontSize: 10, background: '#a78bfa33', color: '#a78bfa', padding: '3px 8px', borderRadius: 4 }}>
            {post.funnelStage}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, color: '#7a7f96', marginBottom: 4 }}>
            Owner: <span style={{ color: '#a8afc0', fontWeight: 600 }}>{post.owner}</span>
          </div>
          <div style={{ fontSize: 10, color: '#7a7f96' }}>
            {post.publishDate && `📅 ${post.publishDate}`}
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            background: WORKFLOW_COLOR[post.workflowStatus as keyof typeof WORKFLOW_COLOR] + '22',
            color: WORKFLOW_COLOR[post.workflowStatus as keyof typeof WORKFLOW_COLOR],
            padding: '4px 8px',
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          {post.workflowStatus}
        </div>
      </div>

      {bucketMeta && (
        <div
          style={{
            marginTop: 10,
            padding: '8px 10px',
            background: bucketMeta.fill,
            border: `1px solid ${bucketMeta.color}44`,
            borderRadius: 6,
            fontSize: 11,
            color: bucketMeta.color,
            fontWeight: 600
          }}
        >
          {bucketMeta.label}
        </div>
      )}

      <button
        onClick={() => onEdit(post)}
        style={{
          marginTop: 10,
          width: '100%',
          padding: '8px 12px',
          background: entity.color + '22',
          border: `1px solid ${entity.color}44`,
          borderRadius: 6,
          color: entity.color,
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = entity.color + '33';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = entity.color + '22';
        }}
      >
        <Eye size={14} style={{ display: 'inline', marginRight: 4 }} /> Edit
      </button>
    </div>
  );
}
