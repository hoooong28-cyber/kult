---
description: How to automatically create a KULT Magazine column from an Instagram link
---
This workflow allows the AI assistant to act as an automated content extractor. When the user provides an Instagram link, the agent will download the post, parse it, and insert it into the KULT Firestore database as a new Magazine column.

## Steps

1. **Extract Shortcode:** Extract the Instagram shortcode from the user's provided URL (e.g., `DWYIXAfDvYN` from `https://www.instagram.com/p/DWYIXAfDvYN/`).

2. **Download Instagram Post:**
Run the following command to download the text and images to a temporary directory.
`mkdir -p /Users/hoo__oong/Desktop/kult/tmp_ig && cd /Users/hoo__oong/Desktop/kult/tmp_ig && python3 -m pip install instaloader --user && python3 -m instaloader --no-videos --no-compress-json -- -[SHORTCODE]`
*(Make sure to replace `[SHORTCODE]` with the actual shortcode, preserving the `-` before it as it's required for Instaloader syntax).*

3. **Read Content & Plan Column:**
Use `view_file` to read the downloaded `.txt` file containing the caption. Analyze the text and the number of downloaded `.jpg` images to plan the Magazine column structure. Follow the strict rules in [instagram_washing_guide.md](file:///Users/hoo__oong/Desktop/kult/.agents/workflows/instagram_washing_guide.md) to wash the content, rewrite the copy into a premium editorial tone (bilingual EN/KR), and map the images to the sections.

4. **Copy Images to App Directory:**
// turbo
`mkdir -p /Users/hoo__oong/Desktop/kult/public/images/ig_post && cp /Users/hoo__oong/Desktop/kult/tmp_ig/-[SHORTCODE]/*.jpg /Users/hoo__oong/Desktop/kult/public/images/ig_post/`

5. **Insert into Firestore:**
Create a temporary Node.js script (e.g., `add_ig_column.mjs`) that uses the Firebase Client SDK to insert the new Magazine document into the `magazines` collection. You should dynamically generate `title`, `titleKr`, and `sections` based on step 3. Make sure the imageUrls point to the files copied in step 4 (e.g., `/images/ig_post/2024-..._1.jpg`).
Execute the script using `run_command`.

6. **Cleanup & Verification:**
Remove the temporary Node script and the `tmp_ig` download directory. Prompt the user to check `http://localhost:5173/magazine`.
