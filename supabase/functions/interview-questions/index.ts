import { corsHeaders } from '../_shared/cors.ts'
import { generateInterviewQuestions } from '../_shared/gemini.ts'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { role, experienceLevel } = await req.json()
        if (!role || !experienceLevel) {
            return new Response(
                JSON.stringify({ error: 'role and experienceLevel are required.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const result = await generateInterviewQuestions(role, experienceLevel)
        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('interview-questions error:', err)
        return new Response(
            JSON.stringify({ error: 'Failed to generate questions. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
