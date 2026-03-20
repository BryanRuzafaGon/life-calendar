import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        iphone_14 = p.devices['iPhone 14 Pro Max']
        context = await browser.new_context(**iphone_14)
        page = await context.new_page()
        await page.goto('file:///C:/Users/Bryan/Documents/calendar/index.html')
        
        # Give JS time to calculate native grid bounds
        await page.wait_for_timeout(2000)
        
        # Click the tab explicitly if necessary (though wallpaper is default hidden until clicked, wait, is it down below?)
        # Let's just click the Wallpaper tab in case it's not default!
        try:
            tab = await page.wait_for_selector('button[data-target="view-wallpaper"]')
            await tab.click()
            await page.wait_for_timeout(1000)
        except Exception:
            pass
            
        # Target the main container to screenshot
        element = await page.query_selector('.iphone-14-pro-max')
        out_path = 'C:/Users/Bryan/.gemini/antigravity/brain/a7ef7e03-1260-449d-a640-33c938887c2e/grid_naked_preview.png'
        if element:
            await element.screenshot(path=out_path)
        else:
            await page.screenshot(path=out_path)
        
        await browser.close()
        print("Screenshot saved to", out_path)

asyncio.run(main())
