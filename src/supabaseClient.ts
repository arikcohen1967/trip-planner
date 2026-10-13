import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://feuiggffrildwnpjjjty.supabase.co'
const supabaseKey = 'sb_publishable_tchXNOjzt_Mii-kqLL-PQ0_GHE6xdQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
