const { chromium } = require('C:/Users/user/AppData/Local/Temp/pw/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.click('text=Войти');
  await page.fill('input[type="tel"]', '77712345678');
  await page.click('text=Продолжить');
  await page.waitForTimeout(300);
  await page.locator('input').last().fill('1111');
  await page.click('text=Продолжить');
  await page.waitForTimeout(300);
  const inputs = page.locator('input');
  await inputs.nth(0).fill('Расул');
  await inputs.nth(1).fill('Абдиров');
  await page.click('text=Готово');
  await page.waitForTimeout(300);
  await page.click('[aria-label="Profile"]');
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/shots/profile_menu.png' });

  await page.click('text=Мои данные');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/shots/profile_data_empty.png' });

  await page.fill('input >> nth=0', 'Расул2');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/shots/profile_data_filled.png' });

  await page.click('text=Сохранить');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/shots/profile_data_saved.png' });

  await browser.close();
})();
