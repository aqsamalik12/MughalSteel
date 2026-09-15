const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const videos = [
  { id: "19QRyxyNGan2e7ca-xepWhEk5UQmISdmn", name: "vid_01.mp4" },
  { id: "1ol-iLtzLY8kjPfnXaZkWrcPa2N8qLsT3", name: "vid_02.mp4" },
  { id: "1ZflrYVMWg0gSS8jIRRGKADKn99kb4ATi", name: "vid_03.mp4" },
  { id: "1m5-vRzIQuGqVGY2KVi2xp4SIGq8m_fpd", name: "vid_04.mp4" },
  { id: "1cD8RHvQ6a_pjNKw-B2laIAvLBa2FEIS7", name: "vid_05.mp4" },
  { id: "1hs5E6zgv22R5HRl0KQMOX_iKFrIald8l", name: "vid_06.mp4" },
  { id: "1ZRLjsfMUaQtLGcY_39UWjqo6-NOPnj5B", name: "vid_07.mp4" },
  { id: "1-L_w16XpXstyw0GoMw-SRJFL4UAWL7t8", name: "vid_08.mp4" },
  { id: "1jmLKjCgu07vmYPXxY314ppI68BX9DmjJ", name: "vid_09.mp4" },
  { id: "1J7X4nIKbFRJL3ql-XfGTpR7asPwCRsXP", name: "vid_10.mp4" },
  { id: "1bJSeMzd11whSpaDfcrrZ8ARVVeUoGLC4", name: "vid_11.mp4" },
  { id: "1Mj0VwRthG8CUzJ7padY8tPVqAg4HU7Yu", name: "vid_12.mp4" },
  { id: "1cRQeZgiP6MCv2hn1n6Ml2LTeAeq1op_M", name: "vid_13.mp4" },
  { id: "1IjRdlOyj5u1s1jpZLlLs5xzoF3-3m393", name: "vid_14.mp4" },
  { id: "1Bad0-vhtpXxpuWO7oLRjIGsVy0eijkHT", name: "vid_15.mp4" },
  { id: "1z_1Sih2W4EO4bkyqQXBXbGORPVFeUdE9", name: "vid_16.mp4" },
  { id: "1MOwnIa4d28wc9TXTKMI4sg54kgf3VIs3", name: "vid_17.mp4" }
];

const outDir = path.join(__dirname, 'downloaded_videos');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    function get(u, redirectCount = 0) {
      if (redirectCount > 5) {
        return reject(new Error('Too many redirects'));
      }
      const parsed = new URL(u);
      const client = parsed.protocol === 'https:' ? https : http;
      
      const req = client.get(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = new URL(res.headers.location, u).toString();
          return get(nextUrl, redirectCount + 1);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Failed with status: ${res.statusCode}`));
        }

        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(destPath));
        });
        file.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
    }

    get(fileUrl);
  });
}

async function start() {
  console.log(`Starting download of ${videos.length} videos...`);
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const dest = path.join(outDir, v.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) {
      console.log(`[${i + 1}/${videos.length}] Already downloaded: ${v.name} (${fs.statSync(dest).size} bytes)`);
      continue;
    }
    const downloadUrl = `https://drive.usercontent.google.com/download?id=${v.id}&export=download`;
    console.log(`[${i + 1}/${videos.length}] Downloading ${v.name}...`);
    try {
      await downloadFile(downloadUrl, dest);
      const sz = fs.statSync(dest).size;
      console.log(`[${i + 1}/${videos.length}] Done: ${v.name} (${(sz / (1024 * 1024)).toFixed(2)} MB)`);
    } catch (e) {
      console.error(`[${i + 1}/${videos.length}] Error on ${v.name}:`, e.message);
    }
  }
  console.log('All downloads completed!');
}

start();
