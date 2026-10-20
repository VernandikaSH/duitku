// One-off admin utility: reset a Supabase Auth user's password directly,
// bypassing the email-based recovery flow (useful when the email rate limit
// is exhausted). Requires the service_role key — never commit it, never
// paste it into chat. Set it as an env var for this one run only.
//
// Usage (PowerShell):
//   $env:SUPABASE_URL="https://your-project.supabase.co"
//   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
//   node scripts/reset-password.mjs someone@example.com NewPassword123

import { createClient } from '@supabase/supabase-js'

const [, , email, newPassword] = process.argv

if (!email || !newPassword) {
  console.error('Usage: node scripts/reset-password.mjs <email> <newPassword>')
  process.exit(1)
}

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars first.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserByEmail(targetEmail) {
  let page = 1
  const perPage = 200

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase())
    if (match) return match
    if (data.users.length < perPage) return null

    page += 1
  }
}

async function main() {
  const user = await findUserByEmail(email)

  if (!user) {
    console.error(`No user found with email ${email}`)
    process.exit(1)
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (error) throw error

  console.log(`Password updated for ${email}. Log in at /login with the new password.`)
}

main().catch((err) => {
  console.error('Failed:', err.message)
  process.exit(1)
})
