import { corsHeaders } from '../_shared/cors.ts'
import { generateEmail } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { emailType, role, company, tone } = await req.json()
        if (!role || !company) {
            return new Response(
                JSON.stringify({ error: 'role and company are required.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const result = await generateEmail(emailType || 'cold', role, company, tone || 'Professional')
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('email-generate error:', err)
        return new Response(
            JSON.stringify({ error: 'Email generation failed. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
