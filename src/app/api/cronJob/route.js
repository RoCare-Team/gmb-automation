import cron from "node-cron";
import connectToDatabase  from "@/lib/mongodb"; // your MongoDB connection file
import Post from "@/models/PostStatus"; // your Mongoose Post model

let jobStarted = false;

export async function GET(req) {
  if (!jobStarted) {
    console.log("✅ Scheduler started...");
    jobStarted = true;

    // Run every minute
    cron.schedule("* * * * *", async () => {
      try {
        const now = new Date();

        await connectToDatabase();

        // find scheduled posts whose time has arrived
        const posts = await Post.find({
          status: "scheduled",
          scheduledDate: { $lte: now },
        });

        for (const post of posts) {
          await handlePost(post);
        }
      } catch (error) {
        console.error("Scheduler error:", error);
      }
    });
  }

  res.status(200).json({ message: "Scheduler is running" });
}
