import asyncio
import json
import os
from PIL import Image
from playwright.async_api import async_playwright

EXT_PATH = "/home/haiva/projects/Flow-NextGen/Version 0.10/dist"
CHROME = "/home/haiva/.cache/ms-playwright/chromium-1228/chrome-linux/chrome"
OUT_DIR = "/home/haiva/projects/Flow-NextGen-Website-Protos/public/images/guide"
PROJECT = "c29fe1b3-c8f3-4858-a93a-41aa4a773b06"

os.makedirs(OUT_DIR, exist_ok=True)

NOW = "2026-09-02T10:00:00.000Z"

MOCK_TASKS = [
    {
        "id": "task-001",
        "jobId": "launch-001",
        "launchId": "launch-001",
        "mode": "text-to-image",
        "status": "complete",
        "prompt": "Cinematic portrait of cyber pilot @maya in neon cockpit, volumetric lighting, 8k",
        "model": "Nano Banana Pro",
        "aspectRatio": "16:9",
        "attempts": 1,
        "maxAttempts": 3,
        "progress": 100,
        "priority": "normal",
        "steps": [],
        "mediaIds": ["media-001"],
        "events": [
            { "at": NOW, "message": "Submitted via API First route", "type": "info" },
            { "at": NOW, "message": "Generated 4 assets successfully", "type": "success" }
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "task-002",
        "jobId": "launch-001",
        "launchId": "launch-001",
        "mode": "text-to-video",
        "status": "complete",
        "prompt": "Cyberpunk street neon rain dolly zoom @maya",
        "model": "Veo 3.1 Lite",
        "aspectRatio": "16:9",
        "videoLength": "8s",
        "attempts": 1,
        "maxAttempts": 3,
        "progress": 100,
        "priority": "normal",
        "steps": [],
        "mediaIds": ["media-002"],
        "events": [
            { "at": NOW, "message": "Video render 100% complete", "type": "success" }
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "task-003",
        "jobId": "launch-001",
        "launchId": "launch-001",
        "mode": "text-to-image",
        "status": "generating",
        "prompt": "Crystal island floating in purple nebula sky, hyper detailed matte painting",
        "model": "Nano Banana Pro",
        "aspectRatio": "1:1",
        "attempts": 1,
        "maxAttempts": 3,
        "progress": 68,
        "priority": "high",
        "steps": [],
        "mediaIds": [],
        "events": [
            { "at": NOW, "message": "Processing latent diffusion batch", "type": "info" }
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "task-004",
        "jobId": "launch-001",
        "launchId": "launch-001",
        "mode": "ingredients-to-video",
        "status": "pending",
        "prompt": "Samurai warrior standing in cherry blossom storm, cinematic anime style",
        "model": "Omni Flash",
        "aspectRatio": "16:9",
        "attempts": 0,
        "maxAttempts": 3,
        "progress": 0,
        "priority": "normal",
        "steps": [],
        "mediaIds": [],
        "events": [],
        "createdAt": NOW,
        "updatedAt": NOW
    }
]

MOCK_LAUNCHES = [
    {
        "id": "launch-001",
        "label": "Cyberpunk Characters & Scenes Batch",
        "mode": "text-to-image",
        "createdAt": NOW,
        "taskIds": ["task-001", "task-002", "task-003", "task-004"],
        "folderName": "Cyberpunk_Characters",
        "status": "running",
        "stats": {
            "total": 4,
            "completed": 2,
            "failed": 0,
            "avgTimeMs": 34200
        }
    }
]

MOCK_MEDIA = [
    {
        "id": "media-001",
        "mediaId": "media-001",
        "type": "image",
        "prompt": "Cinematic portrait of cyber pilot @maya in neon cockpit, volumetric lighting, 8k",
        "createdAt": NOW,
        "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
        "thumbnailUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop",
        "model": "Nano Banana Pro",
        "aspectRatio": "16:9"
    },
    {
        "id": "media-002",
        "mediaId": "media-002",
        "type": "video",
        "prompt": "Cyberpunk street neon rain dolly zoom shot @maya, ultra detailed 8k",
        "createdAt": NOW,
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
        "thumbnailUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop",
        "model": "Veo 3.1 Lite",
        "aspectRatio": "16:9",
        "duration": "8s"
    },
    {
        "id": "media-003",
        "mediaId": "media-003",
        "type": "image",
        "prompt": "Crystal floating island in vibrant sunset clouds, volumetric rays",
        "createdAt": NOW,
        "url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
        "thumbnailUrl": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop",
        "model": "Nano Banana Pro",
        "aspectRatio": "1:1"
    },
    {
        "id": "media-004",
        "mediaId": "media-004",
        "type": "video",
        "prompt": "Cinematic robot awakening in glowing dark laboratory, macro shot",
        "createdAt": NOW,
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
        "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop",
        "model": "Omni Flash",
        "aspectRatio": "16:9",
        "duration": "6s"
    }
]

async def switch_route_via_fiber(sp, route_name):
    await sp.evaluate("""(name) => {
        const rootEl = document.querySelector('#root');
        const fiberKey = Object.keys(rootEl).find(k => k.startsWith('__reactContainer$'));
        let fiber = rootEl[fiberKey];
        const queue = [fiber];
        let appFiber = null;
        while (queue.length > 0) {
            const node = queue.shift();
            if (!node) continue;
            if (node.type && typeof node.type === 'function' && node.type.name === 'App') {
                appFiber = node;
                break;
            }
            if (node.child) queue.push(node.child);
            if (node.sibling) queue.push(node.sibling);
        }
        if (appFiber && appFiber.memoizedState && appFiber.memoizedState.queue) {
            appFiber.memoizedState.queue.dispatch(name);
        }
    }""", route_name)
    await asyncio.sleep(1.5)

async def populate_queue(sp):
    await sp.evaluate("""(data) => {
        const rootEl = document.querySelector('#root');
        const fiberKey = Object.keys(rootEl).find(k => k.startsWith('__reactContainer$'));
        let fiber = rootEl[fiberKey];
        const queue = [fiber];
        let queueFiber = null;
        while (queue.length > 0) {
            const node = queue.shift();
            if (!node) continue;
            if (node.type && typeof node.type === 'function' && node.type.name === 'QueueView') {
                queueFiber = node;
                break;
            }
            if (node.child) queue.push(node.child);
            if (node.sibling) queue.push(node.sibling);
        }
        
        if (queueFiber) {
            let hook = queueFiber.memoizedState;
            let i = 0;
            while (hook) {
                if (i === 2 && hook.memoizedState && hook.memoizedState.setTasks) {
                    hook.memoizedState.setTasks(data.tasks);
                    hook.memoizedState.setLaunches(data.launches);
                    hook.memoizedState.setIsRunning(true);
                    break;
                }
                hook = hook.next;
                i++;
            }
        }
    }""", {"tasks": MOCK_TASKS, "launches": MOCK_LAUNCHES})
    await asyncio.sleep(1.5)

async def populate_gallery(sp):
    await sp.evaluate("""(items) => {
        const rootEl = document.querySelector('#root');
        const fiberKey = Object.keys(rootEl).find(k => k.startsWith('__reactContainer$'));
        let fiber = rootEl[fiberKey];
        const queue = [fiber];
        let galleryFiber = null;
        while (queue.length > 0) {
            const node = queue.shift();
            if (!node) continue;
            if (node.type && typeof node.type === 'function' && node.type.name === 'GalleryView') {
                galleryFiber = node;
                break;
            }
            if (node.child) queue.push(node.child);
            if (node.sibling) queue.push(node.sibling);
        }
        
        if (galleryFiber) {
            let hook = galleryFiber.memoizedState;
            let i = 0;
            while (hook) {
                if (i === 12 && hook.queue) {
                    hook.queue.dispatch(items);
                    break;
                }
                hook = hook.next;
                i++;
            }
        }
    }""", MOCK_MEDIA)
    await asyncio.sleep(1.5)

async def main():
    async with async_playwright() as p:
        ctx = await p.chromium.launch_persistent_context(
            "/tmp/fng-guide-final-profile",
            headless=False,
            executable_path=CHROME,
            args=[
                f"--disable-extensions-except={EXT_PATH}",
                f"--load-extension={EXT_PATH}",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--window-size=1280,950"
            ],
            ignore_default_args=["--disable-extensions", "--enable-automation"],
            viewport={"width": 1280, "height": 950}
        )
        
        await asyncio.sleep(2)
        ext_id = None
        for w in ctx.service_workers:
            if "background" in w.url:
                ext_id = w.url.split("/")[2]
                break
        print(f"Extension ID: {ext_id}")

        # Open Flow tab to bind project
        flow_tab = await ctx.new_page()
        try:
            await flow_tab.goto(f"https://labs.google/fx/tools/flow/project/{PROJECT}", timeout=15000, wait_until="domcontentloaded")
        except Exception as e:
            print("Flow tab notice:", e)

        # Open sidepanel
        sp = await ctx.new_page()
        await sp.set_viewport_size({"width": 440, "height": 850})
        await sp.goto(f"chrome-extension://{ext_id}/src/sidepanel/index.html", wait_until="domcontentloaded")
        await asyncio.sleep(1.5)

        # -------------------------------------------------------------
        # 1. Overview: Bottom Nav Bar ONLY (Cropped)
        # -------------------------------------------------------------
        print("1. Capturing 01-nav-tabs (Bottom Nav Bar Crop)...")
        nav_el = sp.locator("div.fixed.bottom-8")
        try:
            await nav_el.screenshot(path=os.path.join(OUT_DIR, "01-nav-tabs.png"))
            print("   -> 01-nav-tabs.png saved")
        except Exception as e:
            print("   nav locator fallback:", e)
            raw_p = os.path.join(OUT_DIR, "raw_01.png")
            await sp.screenshot(path=raw_p)
            with Image.open(raw_p) as img:
                crop = img.crop((10, img.height - 95, img.width - 10, img.height - 15))
                crop.save(os.path.join(OUT_DIR, "01-nav-tabs.png"))

        # -------------------------------------------------------------
        # 2. Account Tab: User Profile & Quota Card (Cropped)
        # -------------------------------------------------------------
        print("2. Capturing 02-auth-signin (Account Tab Card)...")
        await switch_route_via_fiber(sp, "settings")
        raw_p = os.path.join(OUT_DIR, "raw_02.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 70, img.width - 12, 540))
            crop.save(os.path.join(OUT_DIR, "02-auth-signin.png"))
        print("   -> 02-auth-signin.png saved")

        # -------------------------------------------------------------
        # 3. Text to Image (T2I) Mode (Cropped)
        # -------------------------------------------------------------
        print("3. Capturing 03-mode-t2i...")
        await switch_route_via_fiber(sp, "control")
        await sp.evaluate("""() => {
            const subtabs = Array.from(document.querySelectorAll('button')).filter(b => ['image', 'create image', 'video', 'frame', 'ingredient'].some(k => b.innerText.toLowerCase().includes(k)));
            if (subtabs[0]) subtabs[0].click();
            
            const ta = document.querySelector('textarea');
            if (ta) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                setter.call(ta, '1. Cyberpunk hacker terminal with glowing holograms\\n2. Futuristic street market in the rain @maya\\n3. Neon sports car racing through digital grid');
                ta.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(1)
        raw_p = os.path.join(OUT_DIR, "raw_03.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 65, img.width - 12, 580))
            crop.save(os.path.join(OUT_DIR, "03-mode-t2i.png"))
        print("   -> 03-mode-t2i.png saved")

        # -------------------------------------------------------------
        # 4. Text to Video (T2V) Mode (Cropped)
        # -------------------------------------------------------------
        print("4. Capturing 04-mode-t2v...")
        await sp.evaluate("""() => {
            const subtabs = Array.from(document.querySelectorAll('button')).filter(b => ['image', 'create image', 'video', 'frame', 'ingredient'].some(k => b.innerText.toLowerCase().includes(k)));
            const vidTab = subtabs.find(b => b.innerText.toLowerCase().includes('video'));
            if (vidTab) vidTab.click();
            
            const ta = document.querySelector('textarea');
            if (ta) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                setter.call(ta, 'Cinematic drone shot flying through neo-Tokyo skyline at golden hour, 4k 60fps');
                ta.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(1)
        raw_p = os.path.join(OUT_DIR, "raw_04.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 65, img.width - 12, 560))
            crop.save(os.path.join(OUT_DIR, "04-mode-t2v.png"))
        print("   -> 04-mode-t2v.png saved")

        # -------------------------------------------------------------
        # 5. Frame to Video (I2V / F2V) Mode (Cropped)
        # -------------------------------------------------------------
        print("5. Capturing 05-mode-i2v...")
        await sp.evaluate("""() => {
            const subtabs = Array.from(document.querySelectorAll('button')).filter(b => ['image', 'create image', 'video', 'frame', 'ingredient'].some(k => b.innerText.toLowerCase().includes(k)));
            const frameTab = subtabs.find(b => b.innerText.toLowerCase().includes('frame'));
            if (frameTab) frameTab.click();
            
            const ta = document.querySelector('textarea');
            if (ta) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                setter.call(ta, 'Camera rotates 180 degrees around character while lightning illuminates the sky');
                ta.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(1)
        raw_p = os.path.join(OUT_DIR, "raw_05.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 65, img.width - 12, 620))
            crop.save(os.path.join(OUT_DIR, "05-mode-i2v.png"))
        print("   -> 05-mode-i2v.png saved")

        # -------------------------------------------------------------
        # 6. Ingredients Mode (Cropped)
        # -------------------------------------------------------------
        print("6. Capturing 06-mode-ingredients...")
        await sp.evaluate("""() => {
            const subtabs = Array.from(document.querySelectorAll('button')).filter(b => ['image', 'create image', 'video', 'frame', 'ingredient'].some(k => b.innerText.toLowerCase().includes(k)));
            const ingTab = subtabs.find(b => b.innerText.toLowerCase().includes('ingredient'));
            if (ingTab) ingTab.click();
            
            const ta = document.querySelector('textarea');
            if (ta) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                setter.call(ta, 'Combine the aesthetic of the glowing sword with the cyberpunk samurai costume in a dark alley');
                ta.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(1)
        raw_p = os.path.join(OUT_DIR, "raw_06.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 65, img.width - 12, 620))
            crop.save(os.path.join(OUT_DIR, "06-mode-ingredients.png"))
        print("   -> 06-mode-ingredients.png saved")

        # -------------------------------------------------------------
        # 7. Character Consistency & References (Cropped)
        # -------------------------------------------------------------
        print("7. Capturing 07-characters-tray...")
        await sp.evaluate("""() => {
            const subtabs = Array.from(document.querySelectorAll('button')).filter(b => ['image', 'create image', 'video', 'frame', 'ingredient'].some(k => b.innerText.toLowerCase().includes(k)));
            if (subtabs[0]) subtabs[0].click();
            
            const ta = document.querySelector('textarea');
            if (ta) {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                setter.call(ta, '@maya Futuristic cyber pilot in flight suit [||| voice: Maya ||| info: silver hair, cybernetic eye]');
                ta.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(1)
        raw_p = os.path.join(OUT_DIR, "raw_07.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 65, img.width - 12, 620))
            crop.save(os.path.join(OUT_DIR, "07-characters-tray.png"))
        print("   -> 07-characters-tray.png saved")

        # -------------------------------------------------------------
        # 8. Queue System: Real Task Ledger with Fake Data
        # -------------------------------------------------------------
        print("8. Capturing 09-queue-ledger (Real Queue View + Fake Data)...")
        await switch_route_via_fiber(sp, "queue")
        await populate_queue(sp)
        raw_p = os.path.join(OUT_DIR, "raw_09.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            # Crop the active queue counters + running task + debug log
            crop = img.crop((12, 70, img.width - 12, 680))
            crop.save(os.path.join(OUT_DIR, "09-queue-ledger.png"))
        print("   -> 09-queue-ledger.png saved")

        # -------------------------------------------------------------
        # 9. Media Gallery: Real Grid with Fake Data
        # -------------------------------------------------------------
        print("9. Capturing 10-gallery-grid (Real Gallery View + Fake Media)...")
        await switch_route_via_fiber(sp, "gallery")
        await populate_gallery(sp)
        raw_p = os.path.join(OUT_DIR, "raw_10.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            # Crop the gallery filter bar + media cards
            crop = img.crop((12, 70, img.width - 12, 680))
            crop.save(os.path.join(OUT_DIR, "10-gallery-grid.png"))
        print("   -> 10-gallery-grid.png saved")

        # -------------------------------------------------------------
        # 10. Settings Compiler Tab (Cropped)
        # -------------------------------------------------------------
        print("10. Capturing 11-settings-compiler (Compiler Presets Crop)...")
        await switch_route_via_fiber(sp, "settings")
        await sp.evaluate("""() => {
            const subtabs = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.toLowerCase().includes('compiler'));
            if (subtabs[0]) subtabs[0].click();
        }""")
        await asyncio.sleep(1)
        raw_p = os.path.join(OUT_DIR, "raw_11.png")
        await sp.screenshot(path=raw_p)
        with Image.open(raw_p) as img:
            crop = img.crop((12, 110, img.width - 12, 680))
            crop.save(os.path.join(OUT_DIR, "11-settings-compiler.png"))
        print("   -> 11-settings-compiler.png saved")

        print("Finished capturing all rich cropped guide screenshots!")
        await ctx.close()

if __name__ == "__main__":
    asyncio.run(main())
