-- Seed data untuk development
-- PERHATIAN: Jalankan ini hanya di environment development, BUKAN production
-- Seed ini memerlukan user yang sudah ada di auth.users

-- Catatan: Ganti 'your-user-id-here' dengan UUID dari user yang sudah login
-- Anda bisa mendapatkan user_id dari Supabase Dashboard → Authentication → Users

-- Contoh data lowongan (uncomment dan ganti user_id setelah auth setup):
/*
insert into public.jobs (user_id, title, company_name, location, employment_type, workplace_type, source_name, source_url)
values
  (
    'your-user-id-here',
    'Frontend Engineer',
    'Tokopedia',
    'Jakarta, Indonesia',
    'full_time',
    'hybrid',
    'manual',
    null
  ),
  (
    'your-user-id-here',
    'React Developer',
    'Gojek',
    'Jakarta, Indonesia',
    'full_time',
    'remote',
    'linkedin',
    'https://linkedin.com/jobs/example'
  ),
  (
    'your-user-id-here',
    'Software Engineer',
    'Traveloka',
    'Bali, Indonesia',
    'full_time',
    'onsite',
    'jobstreet',
    null
  );
*/

-- Seed kosong — data diisi melalui aplikasi
select 'Seed file siap. Uncomment data di atas setelah setup auth.' as info;
