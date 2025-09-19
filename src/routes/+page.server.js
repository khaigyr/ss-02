export const actions = {
    saveSession: async ({request}) => {
        const formData = await request.formData();

        const date = formData.get("date");
        const subject = formData.get("subject");
        const rating  = formData.get("rating");
        const duration = formData.get("duration");

        console.log({
            "date": date,
            "subject": subject,
            "rating": rating,
            "duration": duration
        })
    }
}