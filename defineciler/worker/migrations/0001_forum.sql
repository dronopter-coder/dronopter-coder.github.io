-- Defineciler forumu: üyeler, oturumlar, konular, gönderiler, fotoğraflar, şikâyetler, oylar, sayaçlar.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT NOT NULL,
  pass_hash TEXT,
  google_sub TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'member',        -- member | admin
  status TEXT NOT NULL DEFAULT 'active',      -- active | banned
  approved_posts INTEGER NOT NULL DEFAULT 0,  -- onaylanan gönderi sayısı (ilk 3 onaya düşer)
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  csrf TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',     -- pending | published | hidden
  accepted_post_id INTEGER,
  reply_count INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  last_post_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS topics_cat ON topics(category, status, last_post_at DESC);
CREATE INDEX IF NOT EXISTS topics_last ON topics(status, last_post_at DESC);
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_first INTEGER NOT NULL DEFAULT 0,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',     -- pending | published | hidden
  flag_reason TEXT,
  helpful INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  edited_at INTEGER
);
CREATE INDEX IF NOT EXISTS posts_topic ON posts(topic_id, created_at);
CREATE INDEX IF NOT EXISTS posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS posts_user ON posts(user_id);
CREATE TABLE IF NOT EXISTS images (
  key TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  width INTEGER, height INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS images_post ON images(post_id);
CREATE TABLE IF NOT EXISTS reports (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  resolved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, user_id)
);
CREATE TABLE IF NOT EXISTS votes (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);
-- Günlük hız sınırı sayaçları (anahtar: tür:kimlik:gün); IP içeren kayıtlar 30 günden eski olunca silinir.
CREATE TABLE IF NOT EXISTS counters (
  key TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  day TEXT NOT NULL
);
