import { test, expect } from "@playwright/test"

test.describe("MP3 Player", () => {
  test("loads and displays the player after intro animation", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173/")

    // Wait for GSAP intro animation to finish (~4.5s)
    await expect(page.locator(".player-container")).toBeVisible({
      timeout: 8000,
    })

    // Player controls are present
    await expect(
      page.getByRole("button", { name: "Play", exact: true }),
    ).toBeVisible()
    await expect(page.getByRole("button", { name: /next/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /previous/i })).toBeVisible()

    // Playlist is rendered
    await expect(page.locator(".playlist-panel")).toBeVisible()
  })

  test("playlist navigation updates track title", async ({ page }) => {
    await page.goto("http://localhost:5173/")
    await expect(page.locator(".player-container")).toBeVisible({
      timeout: 8000,
    })

    const trackTitle = page.locator(".panel__box__track")

    // Initially shows first track
    await expect(trackTitle).toContainText("Lorn")

    // Clicking a playlist item updates the track
    await page
      .locator(".playlist-panel__track")
      .filter({ hasText: "JUNØ" })
      .click()
    await expect(trackTitle).toContainText("JUNØ")

    // Clicking another updates again
    await page
      .locator(".playlist-panel__track")
      .filter({ hasText: "Sky_s Memoirs" })
      .click()
    await expect(trackTitle).toContainText("Sky_s Memoirs")
  })

  test("next and prev cycle through tracks", async ({ page }) => {
    await page.goto("http://localhost:5173/")
    await expect(page.locator(".player-container")).toBeVisible({
      timeout: 8000,
    })

    const trackTitle = page.locator(".panel__box__track")
    await expect(trackTitle).toContainText("Lorn")

    // Next
    await page.getByRole("button", { name: /next/i }).click()
    await expect(trackTitle).toContainText("ashess")

    // Next
    await page.getByRole("button", { name: /next/i }).click()
    await expect(trackTitle).toContainText("Sky_s Memoirs")

    // Prev
    await page.getByRole("button", { name: /previous/i }).click()
    await expect(trackTitle).toContainText("ashess")

    // Prev back to start
    await page.getByRole("button", { name: /previous/i }).click()
    await expect(trackTitle).toContainText("Lorn")
  })
})
