import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import "./Guide.css";

export function Guide() {
  return (
    <div className="guide-page">
      <SEO
        title="Complete User Guide: All Modes & Features"
        description="Learn how to use all 4 generation modes (Text-to-Image, Text-to-Video, Frame-to-Video, Ingredients-to-Video) in Flow NextGen."
        canonicalPath="/guide"
      />
      <div className="guide-container">
        <h1>Flow NextGen Guide</h1>
        <p className="guide-subtitle">Based on source code analysis of Version 26.36.39 (August 2026).</p>

        <hr className="guide-divider" />

        {/* Table of Contents */}
        <div className="guide-toc">
          <h2>Table of Contents</h2>
          <ol>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#getting-started">Getting Started: Sign In</a></li>
            <li><a href="#generation-modes">Generation Modes</a>
              <ol style={{ listStyle: "lower-alpha", marginTop: 0 }}>
                <li><a href="#t2i">Text to Image (T2I)</a></li>
                <li><a href="#t2v">Text to Video (T2V)</a></li>
                <li><a href="#i2v">Frame to Video (I2V)</a></li>
                <li><a href="#ingredients">Ingredients to Video</a></li>
              </ol>
            </li>
            <li><a href="#characters">Native Characters &amp; Consistency</a></li>
            <li><a href="#flow-packets">Flow Packets (Import &amp; Export)</a></li>
            <li><a href="#autopilot">Autopilot T2I→F2V</a></li>
            <li><a href="#queue">Queue System</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#settings">Settings</a></li>
            <li><a href="#billing">Billing &amp; Tiers</a></li>
          </ol>
        </div>

        {/* ============================================ OVERVIEW ============================================ */}
        <section id="overview">
          <h2>1. Overview</h2>
          <p>
            Flow NextGen is a Chrome extension that works alongside <strong>Google Labs Flow</strong> (at{" "}
            <code>labs.google/fx/tools/flow</code>). It automates image and video generation by sending prompts
            to Google's backend through either the <strong>API (Direct Fetch)</strong> route or the{" "}
            <strong>DOM (Simulated Clicks)</strong> route.
          </p>
          <p>The extension sidepanel has <strong>4 main tabs</strong> (visible in the bottom navigation bar):</p>

          <div className="guide-table-wrapper">
            <table>
              <thead>
                <tr><th>Tab</th><th>Route Name</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Control</strong></td><td><code>control</code></td><td>Set up prompts, references, and launch generation jobs</td></tr>
                <tr><td><strong>Gallery</strong></td><td><code>gallery</code></td><td>Browse, download, upscale, and manage generated media</td></tr>
                <tr><td><strong>Queue</strong></td><td><code>queue</code></td><td>Monitor running and completed generation tasks</td></tr>
                <tr><td><strong>Settings</strong></td><td><code>settings</code></td><td>Account, compiler presets, downloads, system diagnostics</td></tr>
              </tbody>
            </table>
          </div>

          <p>Queue and Gallery tabs are locked for unsigned-in users. You'll see a sign-in prompt.</p>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ GETTING STARTED ============================================ */}
        <section id="getting-started">
          <h2>2. Getting Started: Sign In</h2>
          <ol>
            <li>Open the sidepanel by clicking the Flow NextGen extension icon in Chrome.</li>
            <li>Tap the <strong>Settings</strong> tab (gear icon) in the bottom nav.</li>
            <li>In the <strong>Account</strong> tab, enter your email address and tap <strong>Authorize Session</strong>.</li>
            <li>Check your email for a 6-digit verification code (OTP).</li>
            <li>Enter the code and tap <strong>Complete Authorization</strong>.</li>
          </ol>
          <p>Once signed in, you'll see your user card with plan tier (Free or Pro), the generation quota bar, and subscription management buttons.</p>

          <blockquote>
            <p><strong>Note:</strong> You also need to be signed into Google Labs Flow (<code>labs.google/fx/tools/flow</code>) in a Chrome tab. The extension communicates with Flow through a bridge that runs in that tab.</p>
          </blockquote>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ GENERATION MODES ============================================ */}
        <section id="generation-modes">
          <h2>3. Generation Modes</h2>
          <p>
            The Control tab offers <strong>4 generation modes</strong> selected at the top via a segmented button row:
          </p>

          <div className="guide-table-wrapper">
            <table>
              <thead>
                <tr><th>Mode</th><th>What it does</th><th>Needs References?</th><th>Ref Limit</th><th>Default Model</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Text to Image</strong></td><td>Generate images from text prompts</td><td>Optional</td><td>10</td><td>Nano Banana Pro</td></tr>
                <tr><td><strong>Text to Video</strong></td><td>Generate videos from text prompts</td><td>No</td><td>0</td><td>Veo 3.1 Lite</td></tr>
                <tr><td><strong>Frame to Video</strong></td><td>Generate videos using start/end frame images</td><td>Yes</td><td>2 frames</td><td>Veo 3.1 Lite</td></tr>
                <tr><td><strong>Ingredients</strong></td><td>Generate videos from 3 reference images + prompt</td><td>Yes</td><td>3</td><td>Omni Flash</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Step-by-Step: Using Any Mode</h3>
          <p>All four modes share a <strong>3-step wizard</strong> at the top of the Control view.</p>

          <h4>Step 1: Prompts</h4>
          <ol>
            <li>Tap the <strong>Prompts</strong> step button.</li>
            <li>Select your <strong>Engine Model</strong> from the dropdown (models vary per mode).</li>
            <li>Write your prompts in the text area:
              <ul>
                <li><strong>One per line</strong> mode: each line is a separate prompt.</li>
                <li><strong>Gap line</strong> mode: prompts separated by blank lines.</li>
              </ul>
            </li>
            <li>The gutter on the left shows prompt numbering automatically.</li>
            <li>You can <strong>import a .txt file</strong> (one prompt per line) or paste a <strong>Flow-NextGen Packet</strong> (JSON with full settings).</li>
          </ol>
          <p><strong>Prompt tip:</strong> Use <code>|||</code> as a separator to enable Autopilot. See the <a href="#autopilot">Autopilot section</a>.</p>

          <h4>Step 2: References <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.85rem" }}>(hidden for Text to Video)</span></h4>
          <ol>
            <li>Tap the <strong>References</strong> step button.</li>
            <li>Choose a reference assignment method:</li>
          </ol>

          <div className="guide-table-wrapper">
            <table>
              <thead>
                <tr><th>Mode</th><th>How refs are matched to prompts</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Shared Ref Upload</strong></td><td>All prompts share the same reference images</td></tr>
                <tr><td><strong>1:1 Batch Upload</strong></td><td>Prompt line 1 → image 1, prompt line 2 → image 2, etc.</td></tr>
                <tr><td><strong>Auto Match</strong></td><td>Fuzzy-match prompt keywords to reference filenames</td></tr>
                <tr><td><strong>Repeat 1st Prompt</strong></td><td>First prompt's text is reused for all image slots</td></tr>
              </tbody>
            </table>
          </div>

          <ol start={3}>
            <li><strong>Upload images</strong> by clicking <strong>Add To Device Tray</strong>. Images appear in the <strong>Device References</strong> tray.</li>
            <li><strong>For Frame to Video mode:</strong> Drag references onto <strong>Start Frame</strong> and <strong>End Frame</strong> slots.</li>
            <li><strong>For Ingredients mode:</strong> Select up to 3 references to use as ingredients.</li>
            <li>You can also pull media from your <strong>Flow project gallery</strong> via the <strong>From Project Media</strong> button.</li>
          </ol>

          <h4>Step 3: Launch</h4>
          <ol>
            <li>Tap the <strong>Launch</strong> step button.</li>
            <li>Review the prompt-to-reference mapping.</li>
            <li>Configure parameters (see below).</li>
            <li>Choose a <strong>Project Target Mode</strong>:
              <ul>
                <li><strong>Create New Project</strong>: creates a new Flow project for these generations.</li>
                <li><strong>Use Current Project</strong>: uses the currently open Flow project tab.</li>
              </ul>
            </li>
            <li>Tap <strong>Launch N Prompts</strong>.</li>
          </ol>
          <p>The queue starts automatically. The launch button changes to show dispatch progress, and you're redirected to the Queue tab.</p>

          <h4>Parameters on the Launch Step</h4>
          <div className="guide-table-wrapper">
            <table>
              <thead>
                <tr><th>Parameter</th><th>What it does</th><th>Options</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Aspect Ratio</strong></td><td>Output shape</td><td>T2I: Landscape (16:9), Landscape (4:3), Square (1:1), Portrait (3:4), Portrait (9:16). Video: Landscape (16:9), Portrait (9:16)</td></tr>
                <tr><td><strong>Generations / Prompt</strong></td><td>How many outputs per prompt</td><td>x1, x2, x3, x4</td></tr>
                <tr><td><strong>Video Length</strong></td><td>Duration (video modes only, Omni Flash only)</td><td>4s, 6s, 8s, 10s (Veo models are fixed 8s)</td></tr>
                <tr><td><strong>Silent Videos</strong></td><td>Generate without audio</td><td>ON / OFF</td></tr>
                <tr><td><strong>Auto-Download Outputs</strong></td><td>Save files to disk automatically</td><td>ON / OFF (default: ON)</td></tr>
                <tr><td><strong>Download Resolution</strong></td><td>Quality of saved files</td><td>270p, 720p, 1080p, 4K (higher tiers unlock higher res)</td></tr>
                <tr><td><strong>Submission Route</strong></td><td>How to send prompts</td><td>API First (Direct Fetch) or DOM First (Simulated Clicks)</td></tr>
                <tr><td><strong>Autopilot (T2I→F2V)</strong></td><td>Auto-animate T2I results into videos</td><td>OFF / Animate All / Animate One</td></tr>
              </tbody>
            </table>
          </div>

          {/* --- T2I --- */}
          <h3 id="t2i">Text to Image (T2I)</h3>
          <p><strong>Available models:</strong></p>
          <ul>
            <li><strong>Nano Banana Pro</strong> (default), best quality/speed balance</li>
            <li><strong>Nano Banana 2</strong>, higher quality</li>
            <li><strong>Nano Banana 2 Lite</strong>, faster, lower quality</li>
          </ul>
          <p><strong>Aspect ratios:</strong> Landscape (16:9), Landscape (4:3), Square (1:1), Portrait (3:4), Portrait (9:16)</p>
          <p><strong>Key settings:</strong></p>
          <ul>
            <li>Generations per prompt: 1–4 (default: 4)</li>
            <li>Image model selector in Settings &gt; Compiler tab</li>
            <li>Supports reference images (up to 10) via Shared, Batch, or Auto Match mode</li>
            <li>Autopilot allows automatic text-to-video chaining (see below)</li>
          </ul>
          <div className="guide-screenshot">
            <strong>SCREENSHOT SUGGESTIONS:</strong> Mode selector with "Create Image" selected · Engine Model dropdown showing Nano Banana Pro · Prompt textarea with example prompts · Reference assignment grid (Shared/Batch/Auto Match/Repeat) · Launch step with parameters
          </div>

          {/* --- T2V --- */}
          <h3 id="t2v">Text to Video (T2V)</h3>
          <p><strong>Available models:</strong></p>
          <ul>
            <li><strong>Veo 3.1 Lite</strong> (default), fastest</li>
            <li><strong>Veo 3.1 Fast</strong>, balanced</li>
            <li><strong>Veo 3.1 Quality</strong>, highest quality</li>
            <li><strong>Omni Flash</strong>, supports variable duration (4/6/8/10s)</li>
          </ul>
          <p><strong>Aspect ratios:</strong> Landscape (16:9), Portrait (9:16)</p>
          <p><strong>Key differences from T2I:</strong></p>
          <ul>
            <li>No reference images needed, Step 2 is skipped entirely</li>
            <li>Video length selector visible only for Omni Flash (Veo models fixed at 8s)</li>
            <li>Silent video toggle available</li>
            <li>Downloads use video resolution options (270p → 4K)</li>
          </ul>
          <div className="guide-screenshot">
            <strong>SCREENSHOT SUGGESTIONS:</strong> Mode selector with "Text to Video" selected · Model dropdown showing Veo 3.1 Lite, Omni Flash, etc. · Video Length selector (shown when Omni Flash is selected) · Silent Video toggle
          </div>

          {/* --- I2V --- */}
          <h3 id="i2v">Frame to Video (I2V)</h3>
          <p>Also called "Frame to Video" or "Image to Video."</p>
          <p><strong>Available models:</strong> Same as Text to Video (Veo 3.1 Lite, Fast, Quality, Omni Flash)</p>
          <p><strong>How it works:</strong></p>
          <ol>
            <li>Write a text prompt describing the motion/animation.</li>
            <li>Assign a <strong>Start Frame</strong> (required) and optionally an <strong>End Frame</strong>.</li>
            <li>The model generates a video that transitions from the start frame toward the end frame while following your prompt.</li>
          </ol>
          <p><strong>Frame slot assignment:</strong></p>
          <ul>
            <li>Drag images from the Device References tray onto the Start Frame or End Frame zone.</li>
            <li>Tap a device reference to cycle through slot assignment.</li>
            <li>Drop zones show a visual highlight when dragging over them.</li>
          </ul>
          <div className="guide-screenshot">
            <strong>SCREENSHOT SUGGESTIONS:</strong> Mode selector with "Frame to Video" selected · Start Frame and End Frame drop zones with images assigned · Reference trays showing available images
          </div>

          {/* --- Ingredients --- */}
          <h3 id="ingredients">Ingredients to Video</h3>
          <p>Also called "Ingredients."</p>
          <p><strong>Available models:</strong> Omni Flash (default), Veo 3.1 Lite, Veo 3.1 Fast, Veo 3.1 Quality</p>
          <p><strong>How it works:</strong></p>
          <ol>
            <li>Upload 3 or fewer reference images ("ingredients").</li>
            <li>Write a text prompt describing the scene.</li>
            <li>The model combines the visual elements from your references into a single video.</li>
          </ol>
          <div className="guide-screenshot">
            <strong>SCREENSHOT SUGGESTIONS:</strong> Mode selector with "Ingredients" selected · Reference selection with up to 3 images · Model dropdown (note Omni Flash is default)
          </div>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ CHARACTERS ============================================ */}
        <section id="characters">
          <h2>4. Native Characters &amp; Consistency</h2>
          <p>
            Flow NextGen includes a hybrid <strong>Character Consistency Engine</strong> that connects <code>@handle</code> definitions in your prompt text directly to Google Flow's native character entities.
          </p>

          <h3>Defining Characters with @handle</h3>
          <p>You can define character profiles in your prompt input using the <code>@handle</code> syntax:</p>
          <pre style={{ background: "rgba(0,0,0,0.4)", padding: "12px", borderRadius: "8px", color: "var(--accent-color)" }}>
            <code>@maya Futuristic cyber pilot in leather jacket [||| voice: Maya ||| info: brown eyes, silver hair]</code>
          </pre>

          <h3>How Native Chip Binding Works</h3>
          <ol>
            <li><strong>Backend Entity Scan:</strong> When you open a project, Flow NextGen scans Google Flow's initial data to find existing character entities.</li>
            <li><strong>Chip Replay:</strong> During prompt dispatch, the extension replaces <code>@handle</code> references with Google Flow's native <code>AT_TAG</code> character chips (<code>characterServerId</code>).</li>
            <li><strong>Intelligent Fallback:</strong> If native chip verification is unavailable or fails, the engine gracefully degrades to prompt text expansion—ensuring generation never fails silently.</li>
          </ol>

          <h3>Reference Trays</h3>
          <div className="guide-table-wrapper">
            <table>
              <thead>
                <tr><th>Tray</th><th>Source</th><th>Usage</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Device References</strong></td><td>Uploaded from local disk</td><td>Use for general reference images, start/end frames, and ingredients.</td></tr>
                <tr><td><strong>Project Character References</strong></td><td>Live Google Flow backend scan</td><td>Shows active character entities tied to the current project and active prompt session.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ FLOW PACKETS ============================================ */}
        <section id="flow-packets">
          <h2>5. Flow Packets (Import &amp; Export)</h2>
          <p>
            <strong>Flow Packets</strong> are structured bundles containing your prompt suites, generation mode settings, and <code>@handle</code> character definitions in a single shareable format (<code>.json</code> or <code>.txt</code>).
          </p>

          <h3>Importing a Flow Packet</h3>
          <ol>
            <li>In Step 1 (Prompts), click <strong>Import Packet</strong> or paste the packet JSON directly into the prompt text area.</li>
            <li>The extension automatically parses the packet sections (<code># CHARACTER PROMPTS</code>, <code># VIDEO PROMPTS</code>, <code># NOTES</code>).</li>
            <li>Mode, aspect ratio, models, and reference assignments are pre-populated instantly.</li>
          </ol>

          <h3>Exporting a Flow Packet</h3>
          <ol>
            <li>Configure your prompts and character mappings in the Control tab.</li>
            <li>Click <strong>Export Packet</strong> from the top action toolbar.</li>
            <li>Save the generated <code>.json</code> packet to share with team members or store for future runs.</li>
          </ol>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ AUTOPILOT ============================================ */}
        <section id="autopilot">
          <h2>6. Autopilot (T2I→F2V)</h2>
          <p>
            Autopilot automatically chains <strong>Text to Image</strong> outputs into <strong>Image to Video</strong> (Frame to Video) follow-ups.
          </p>
          <p><strong>How to use:</strong></p>
          <ol>
            <li>Select <strong>Text to Image</strong> mode.</li>
            <li>Write prompts using the <code>|||</code> separator format: <code>image prompt ||| video prompt</code>
              <br />Example: <code>A cyberpunk city at night ||| Dolly zoom through neon-lit streets</code>
            </li>
            <li>In the Launch step, set <strong>Autopilot</strong> to:
              <ul>
                <li><strong>Animate All</strong>: every prompt generates an image AND a follow-up video.</li>
                <li><strong>Animate One</strong>: only the first prompt generates a follow-up video.</li>
              </ul>
            </li>
            <li>When Autopilot is active, additional settings appear:
              <ul>
                <li><strong>Video Model</strong>: which model to use for the F2V step</li>
                <li><strong>Generations</strong>: how many video outputs per image</li>
                <li><strong>Duration</strong>: video length (4-10s)</li>
                <li><strong>Download Resolution</strong>: video quality</li>
              </ul>
            </li>
          </ol>
          <blockquote>
            <p>Autopilot is automatically set to OFF if your prompts don't use the <code>|||</code> format. A warning message appears explaining the required format.</p>
          </blockquote>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ QUEUE ============================================ */}
        <section id="queue">
          <h2>7. Queue System</h2>
          <p>The <strong>Queue</strong> tab (<code>/queue</code>) shows all generation tasks grouped by launch.</p>

          <h3>How to Queue Prompts</h3>
          <ol>
            <li>Build your prompts in the Control tab (Steps 1–3).</li>
            <li>Tap <strong>Launch N Prompts</strong> at the bottom of Step 3.</li>
            <li>The extension dispatches a <code>DispatchBatch</code> message to the background worker.</li>
            <li>Each prompt becomes a <strong>QueueTask</strong> with status tracking.</li>
            <li>Tasks are grouped into a <strong>LaunchJob</strong> (a single batch run).</li>
          </ol>

          <h3>Queue Controls</h3>
          <div className="guide-table-wrapper">
            <table>
              <thead><tr><th>Button</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td><strong>Pause / Resume</strong></td><td>Pause or resume queue processing</td></tr>
                <tr><td><strong>Retry Failed</strong></td><td>Re-submit all failed/blocked tasks</td></tr>
                <tr><td><strong>Clear Failed</strong></td><td>Remove all failed tasks from the list</td></tr>
                <tr><td><strong>Clear Done</strong></td><td>Remove all completed tasks</td></tr>
                <tr><td><strong>Clear All</strong> (red)</td><td>Stop and delete all queued tasks</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Monitoring Progress</h3>
          <p>The queue header shows 4 live counters:</p>
          <ul>
            <li><strong>Active</strong>: currently submitting, generating, or downloading</li>
            <li><strong>Avg Time</strong>: average completion time for completed tasks</li>
            <li><strong>Succeeded</strong>: count of completed tasks</li>
            <li><strong>Failed</strong>: count of failed/blocked tasks</li>
          </ul>
          <p>Each launch group is shown as an <strong>accordion card</strong>:</p>
          <ul>
            <li><strong>Status badge</strong> (running/complete/failed)</li>
            <li><strong>Progress bar</strong> (percentage of tasks done)</li>
            <li><strong>Time stamp</strong> (when the launch started)</li>
            <li>Expand to see individual tasks with their own status indicators</li>
          </ul>
          <p>Click a task to expand more details including error messages and event logs.</p>

          <h3>Scheduler Debug Log</h3>
          <p>At the bottom of the Queue view, a terminal-like log shows real-time events:</p>
          <ul>
            <li>Filter: <strong>All</strong>, <strong>Errors</strong>, or <strong>Success</strong> only</li>
            <li>Auto-scrolls to new entries</li>
            <li>Each entry shows timestamp, event type, and message</li>
          </ul>

          <h3>Retry Behavior</h3>
          <ul>
            <li><strong>Individual retry:</strong> Click the retry icon on any failed task.</li>
            <li><strong>Batch retry:</strong> Click the retry icon on a launch group to retry all failed tasks in that batch.</li>
            <li><strong>Infinite Auto-Retry:</strong> Enable in Settings &gt; Compiler to keep retrying until manual cancellation.</li>
          </ul>

          <h3>How Downloads Work</h3>
          <p>After a task completes, the <strong>AutoDownloadService</strong> (background worker):</p>
          <ol>
            <li>Checks if auto-download is enabled (per-mode setting).</li>
            <li>Fetches the generated media URL.</li>
            <li>Saves files to your browser's download directory.</li>
            <li>Uses a 1-second stagger between downloads to avoid Chrome rate limits.</li>
          </ol>
          <p>Files are named using the configured <strong>Filename Template Style</strong> (see Settings &gt; Downloads).</p>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ GALLERY ============================================ */}
        <section id="gallery">
          <h2>8. Gallery</h2>
          <p>The <strong>Gallery</strong> tab (<code>/gallery</code>) shows all media generated in your Flow project.</p>

          <h3>How to Find Generated Media</h3>
          <ol>
            <li>Open the <strong>Gallery</strong> tab.</li>
            <li>If it's your first time, tap <strong>Scan Project</strong> to sync media from your Flow project.</li>
            <li>The gallery scans the Flow project page DOM using <code>fullScroll: true</code> to load all lazy media.</li>
            <li>Items are stored locally in the <code>MediaLedger</code> (chrome.storage.local).</li>
          </ol>

          <h3>Filters &amp; Sorting</h3>
          <div className="guide-table-wrapper">
            <table>
              <thead><tr><th>Control</th><th>Options</th></tr></thead>
              <tbody>
                <tr><td><strong>Media type filter</strong></td><td>All, Videos, Images, Generating</td></tr>
                <tr><td><strong>Resolution filter</strong></td><td>All, 1K, 2K, 4K</td></tr>
                <tr><td><strong>Sort</strong></td><td>Newest First, Oldest First</td></tr>
                <tr><td><strong>Search</strong></td><td>Free text search across prompts</td></tr>
                <tr><td><strong>Layout</strong></td><td>Grid view or Table view</td></tr>
                <tr><td><strong>Thumbnails</strong></td><td>Small or Large</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Actions on Media</h3>
          <div className="guide-table-wrapper">
            <table>
              <thead><tr><th>Action</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td><strong>Download</strong></td><td>Download the media at the configured resolution</td></tr>
                <tr><td><strong>Regenerate</strong></td><td>Re-submit the prompt as a new generation task</td></tr>
                <tr><td><strong>Upscale</strong> <span className="guide-badge pro">Pro</span></td><td>Enhance resolution (720p/1080p/4K for video; 1K/2K/4K for images)</td></tr>
                <tr><td><strong>Trash</strong></td><td>Delete from both local storage and Flow server</td></tr>
                <tr><td><strong>Preview</strong></td><td>Open in a lightbox modal with playback controls</td></tr>
                <tr><td><strong>Select</strong> (checkbox)</td><td>Select for batch operations</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Batch Operations</h3>
          <ul>
            <li>Tap the selection checkbox on multiple items.</li>
            <li>Use the batch toolbar to <strong>Download Selected</strong> or <strong>Delete Selected</strong>.</li>
            <li>Batch upscale picker available for Pro users.</li>
          </ul>

          <h3>Lightbox Preview</h3>
          <p>Tap any media item to open the lightbox:</p>
          <ul>
            <li>Full-size preview with zoom.</li>
            <li>Video playback with speed control (0.5x–2x) and mute toggle.</li>
            <li>Prompt text displayed below the media.</li>
            <li>Direct download and regenerate buttons.</li>
          </ul>

          <h3>Upscaling <span className="guide-badge pro">Pro Only</span></h3>
          <p>Pro users can upscale individual media items:</p>
          <ol>
            <li>Hover over a media item and tap the <strong>Upscale</strong> icon (maximize icon).</li>
            <li>Choose from the resolution picker:
              <ul>
                <li><strong>Videos:</strong> 720p, 1080p, 4K (4K costs 50 credits)</li>
                <li><strong>Images:</strong> 1K, 2K, 4K</li>
              </ul>
            </li>
            <li>The upscale request is sent to the background worker.</li>
            <li>A loading spinner appears while processing.</li>
          </ol>
          <p>Free-tier users see a <strong>lock icon</strong> and are prompted to upgrade.</p>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ SETTINGS ============================================ */}
        <section id="settings">
          <h2>9. Settings</h2>
          <p>The <strong>Settings</strong> tab has <strong>5 sub-tabs</strong>: Account, Compiler, Downloads, System, Debugger.</p>

          <h3>Account Tab</h3>
          <div className="guide-table-wrapper">
            <table>
              <thead><tr><th>Setting</th><th>Description</th><th>Default</th></tr></thead>
              <tbody>
                <tr><td><strong>Email input</strong></td><td>Enter your email to sign in</td><td></td></tr>
                <tr><td><strong>OTP input</strong></td><td>6-digit verification code sent to your email</td><td></td></tr>
                <tr><td><strong>Authorize Session</strong></td><td>Sends OTP or verifies code</td><td></td></tr>
                <tr><td><strong>Resend Code</strong></td><td>Re-send OTP (60s cooldown)</td><td></td></tr>
                <tr><td><strong>Upgrade to Pro</strong></td><td>Opens Dodo Payments checkout to purchase Pro</td><td></td></tr>
                <tr><td><strong>Manage Subscription</strong></td><td>Opens Dodo Payments customer portal (Pro users)</td><td></td></tr>
                <tr><td><strong>Sync Subscription</strong></td><td>Force sync tier from Dodo/Supabase</td><td></td></tr>
                <tr><td><strong>Refresh Session</strong></td><td>Re-fetch profile from Supabase</td><td></td></tr>
                <tr><td><strong>Re-sync Subscription</strong></td><td>Full subscription status resync</td><td></td></tr>
                <tr><td><strong>Reset Auth State</strong></td><td>Clear local session data</td><td></td></tr>
                <tr><td><strong>Sign Out</strong></td><td>End session</td><td></td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>Displayed info:</strong></p>
          <ul>
            <li>Active email and plan tier badge</li>
            <li>Generation quota bar (Free: used/30 limit; Pro: Unlimited)</li>
            <li>Remaining prompts count</li>
            <li>Time until quota reset (Free: 06:00 UTC)</li>
            <li>Renew date (Pro)</li>
            <li>Grace period countdown (past_due)</li>
          </ul>

          <h3>Compiler Tab</h3>
          <div className="guide-table-wrapper">
            <table>
              <thead><tr><th>Setting</th><th>Description</th><th>Options</th><th>Default</th></tr></thead>
              <tbody>
                <tr><td><strong>Submit Path Preference</strong></td><td>Route for sending prompts</td><td>API First (Direct Fetch), DOM First (Simulated Clicks)</td><td>API First</td></tr>
                <tr><td><strong>Infinite Auto-Retry</strong></td><td>Keep retrying failed tasks forever</td><td>ON/OFF</td><td>OFF</td></tr>
                <tr><td><strong>Video Model</strong></td><td>Default model for video modes</td><td>Veo 3.1 Lite, Omni Flash, Veo 3.1 Fast, Veo 3.1 Quality</td><td>Veo 3.1 Lite</td></tr>
                <tr><td><strong>Videos Per Task</strong></td><td>How many videos per prompt</td><td>1–4</td><td>1</td></tr>
                <tr><td><strong>Video Aspect Ratio</strong></td><td>Default ratio for video</td><td>Landscape (16:9), Portrait (9:16)</td><td>Landscape</td></tr>
                <tr><td><strong>Silent Videos</strong></td><td>Generate without audio</td><td>ON/OFF</td><td>OFF</td></tr>
                <tr><td><strong>Ingredients Video Model</strong></td><td>Default model for Ingredients mode</td><td>Omni Flash, Veo 3.1 Lite, Veo 3.1 Fast, Veo 3.1 Quality</td><td>Omni Flash</td></tr>
                <tr><td><strong>Image Model</strong></td><td>Default model for image modes</td><td>Nano Banana Pro, Nano Banana 2, Nano Banana 2 Lite</td><td>Nano Banana Pro</td></tr>
                <tr><td><strong>Images Per Task</strong></td><td>How many images per prompt</td><td>1–4</td><td>4</td></tr>
                <tr><td><strong>Image Aspect Ratio</strong></td><td>Default ratio for images</td><td>Landscape (16:9), Landscape (4:3), Square (1:1), Portrait (3:4), Portrait (9:16)</td><td>Square</td></tr>
                <tr><td><strong>Generation Wait Min</strong></td><td>Minimum seconds between each generation</td><td>1–any</td><td>30</td></tr>
                <tr><td><strong>Generation Wait Max</strong></td><td>Maximum seconds between each generation</td><td>1–any</td><td>60</td></tr>
                <tr><td><strong>Start From Number</strong></td><td>Index to start counting from</td><td>1–any</td><td>1</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className="guide-divider" />

        {/* ============================================ BILLING ============================================ */}
        <section id="billing">
          <h2>10. Billing &amp; Tiers</h2>
          <p><strong>Free Tier:</strong></p>
          <ul>
            <li>30 generations per day (resets at 06:00 UTC)</li>
            <li>Core automation features</li>
            <li>Standard download resolution</li>
          </ul>
          <p><strong>Pro Tier ($9.99/month):</strong></p>
          <ul>
            <li>Unlimited generation</li>
            <li>Priority queue scheduling</li>
            <li>Upscaling to 4K</li>
            <li>Higher download resolutions</li>
          </ul>
          <p>See <Link to="/pricing">Pricing Page</Link> for current details.</p>
        </section>

        <hr className="guide-divider" />

        <div className="guide-footer">
          <p>
            <Link to="/">Home</Link> · <Link to="/pricing">Pricing</Link> ·{" "}
            <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link> ·{" "}
            <Link to="/refund">Refund</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
