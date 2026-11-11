export interface ForumEnv {
  FORUM_DB?: D1Database;
  FORUM_IMG?: R2Bucket;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  /** Yönetici kullanıcı adları (virgülle) */
  FORUM_ADMINS?: string;
}

export type User = {
  id: number;
  username: string;
  display_name: string;
  pass_hash: string | null;
  google_sub: string | null;
  role: 'member' | 'admin';
  status: 'active' | 'banned';
  approved_posts: number;
  created_at: number;
};

export type Status = 'pending' | 'published' | 'hidden';

export type Topic = {
  id: number;
  category: string;
  user_id: number;
  title: string;
  slug: string;
  status: Status;
  accepted_post_id: number | null;
  reply_count: number;
  views: number;
  created_at: number;
  last_post_at: number;
  username?: string;
  display_name?: string;
};

export type Post = {
  id: number;
  topic_id: number;
  user_id: number;
  is_first: number;
  body: string;
  status: Status;
  flag_reason: string | null;
  helpful: number;
  created_at: number;
  username?: string;
  display_name?: string;
};

export const CATEGORIES = [
  { id: 'eser-tanima', label: 'Eser ve sikke tanıma', desc: 'Sikke, seramik, mühür, kandil ve diğer eserler hakkında sorular' },
  { id: 'isaretler', label: 'Define işaretleri ve anlamları', desc: 'Taş ve kaya işaretlerinin halk yorumu ile arkeolojik karşılığı' },
  { id: 'tarih', label: 'Tarih ve uygarlıklar', desc: 'Anadolu’nun uygarlıkları, dönemler, kaynaklar' },
  { id: 'muzeler', label: 'Müzeler ve ören yerleri', desc: 'Gezi önerileri, müze deneyimleri, ören yerleri' },
  { id: 'yasal', label: 'Yasal süreç ve eser bildirimi', desc: '2863 sayılı Kanun, bildirim, müze süreçleri' },
  { id: 'uygulama', label: 'Defineciler uygulaması', desc: 'Destek, öneri ve hata bildirimleri' },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]['id'];
