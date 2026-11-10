---
name: 3d-decoration-asset
description: "Builds 3D and animated web assets from a reference image or a prompt, with paid cloud generation only after cost approval. Use when a site needs a cursor-following mascot, a scroll sequence or a GLB model."
---

# 3D decoration assets

The goal is an asset that keeps the reference's identity, runs at the lightest rendering tier that delivers the behavior, and is proven in a real browser. Generation runs in the cloud through a provider adapter, so the machine needs no model weights, GPU stack or 3D suite.

## Rendering tiers

| The behavior needs | Deliver |
|---|---|
| A transform of an existing image (tilt, glow, mask, reveal) | CSS, SVG or Canvas |
| A character that turns toward the cursor | A sprite sheet or aligned image states |
| An object turned by drag or scrubbed by scroll, up to 360° | An image sequence |
| An ambient loop with no input | A muted, inline video |
| Free rotation, dynamic lighting or articulated motion | A textured GLB |

A rendered picture of an object is an image asset. Call an asset 3D only when it is a GLB that passes `scripts/inspect-glb.mjs`.

## Providers

Runware is the default backend and its adapter is [references/runware.md](references/runware.md). Another provider fits the same steps when it offers live pricing, accepts uploaded reference images and returns downloadable files; record its equivalents in the manifest.

## Steps

1. Brief. Read the request, every reference image, the target page and its components, the front-end stack and the viewports. Done when you can state in one line the behavior, the input that drives it, the tier from the table and whether a supplied or existing asset already covers it. When it does, go to step 5.

2. Asset plan. Fix camera, framing, scale, lighting, palette and the subject's identifying traits. List every state the tier needs (view, gaze angle, frame count) with one shared crop and a safe margin so no pose clips. Mark every side the reference does not show as inferred. Done when each state has a row in the plan.

3. Cost approval. Follow the provider adapter to pick a model and read its live price, input schema and license. Show the user the model, the price per attempt, the attempts the plan needs and the total. Generate only after the user approves that budget in chat, and ask again before going past it. Ask before uploading a reference the user may consider confidential. Done when the user has approved model and budget.

4. Pilot, then batch. Generate one state or one short clip first. Compare it with the reference and reject identity drift, wrong anatomy, framing errors and perspective that disagrees with the other states. Each state gets three rounds; after the third failed round, stop that state and report the defect with the best attempt. Done when every state in the plan is accepted or reported as failed. Label each deliverable as what it is, so a mock-up stays a mock-up.

5. Interaction. Map each accepted asset to a normalized input such as cursor x and y, angle, scroll progress or hover. Smooth the input, clamp both ends and give touch devices a defined behavior. Use sprites or image sequences when the interaction needs random frame access, because video seeking lags behind a cursor. Done when both ends of every input range show the intended state.

6. Integration. Make the smallest change that ships the behavior, inside the project's design system and existing libraries. Put web-delivery files in the project's public assets directory and keep references and generation records outside it. Pause loops while offscreen and serve a static frame under `prefers-reduced-motion`. Done when the feature works and temporary debug code is gone.

7. Proof. Run the project's checks, then open the page in a real browser at desktop and mobile widths. Observe movement, crop, aspect ratio, transparency, pointer and focus behavior, loading, console errors and transfer size. For a GLB, run `node scripts/inspect-glb.mjs <file>`: it must exit 0, list textures for a textured model and list an animation when one is claimed. Capture a frame beside the reference. Done when every check has observed evidence or is listed as unverified.

## Manifest

Hand over the component, the assets and a short manifest with file paths, model identifiers, source images, license, credits spent, runtime requirements, interaction behavior, file sizes, the checks run with their outcome and any defect left open.
