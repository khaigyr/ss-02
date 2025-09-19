import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from "$env/static/private";
import { fail, json } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';


console.log(UPSTASH_REDIS_REST_TOKEN)
console.log(UPSTASH_REDIS_REST_URL)
// Initialize Redis
const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN
});

export async function load() {
    try {
        const keys = await redis.keys('session:*')

        if (keys.length === 0) {
            return {
                sessions: []
            }
        }

        const sessions = await redis.mget(...keys);

        return {
            sessions: sessions
        }
    } catch (err) {
        console.error("Error fetching data from redis:", err)

        return {
            sessions: []
        }
    }
}


export const actions = {
    saveSession: async ({ request }) => {
        const formData = await request.formData();

        const date = formData.get("date");
        const subject = formData.get("subject");
        const rating = formData.get("rating");
        const duration = formData.get("duration");

        console.log({
            "date": date,
            "subject": subject,
            "rating": rating,
            "duration": duration
        })

        try {
            const id = `session:${crypto.randomUUID()}`

            await redis.set(id, JSON.stringify(
                {
                    "date": date,
                    "subject": subject,
                    "rating": rating,
                    "duration": duration
                }
            ))

            return {success: true}
        } catch(err) {
            console.error("Error saving to redis:", err)

            return fail(500, {
                error: "500 error"
            })
        }
    }
}