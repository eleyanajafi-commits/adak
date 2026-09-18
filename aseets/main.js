/**
 * مشاور املاک آداک عالیشهر (مدیریت: نجفی)
 * فایل اصلی منطق جاوااسکریپت و تعاملات وب‌سایت
 */

// تبدیل اعداد انگلیسی به فارسی
function toPersianDigits(n) {
  if (n === null || n === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (d) => persianDigits[d]);
}

// شماره‌های تماس ثابت و معتبر
const CONTACT_CONFIG = {
  phone1: "09016796373",
  phone1Formatted: "0901 679 6373",
  phone2: "09170627208",
  phone2Formatted: "0917 062 7208",
  telegramUsername: "adak_realestate",
  managerName: "جناب آقای نجفی",
  officeAddress: "استان بوشهر، شهر جدید عالیشهر، فاز یک، بلوار خلیج فارس، مجتمع تجاری کوروش، جنب فروشگاه اتکا",
  mapsUrl: "https://maps.google.com/?q=28.9328,51.0592",
  neshanUrl: "https://neshan.org/maps/@28.9328,51.0592,16z"
};

// نمایش اعلان موقت (Toast)
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ساخت لینک استعلام تلگرام با متن پیش‌فرض
function generateTelegramLink(text) {
  const encodedText = encodeURIComponent(text);
  return `https://t.me/share/url?url=${encodeURIComponent('https://adak-alishahr.ir')}&text=${encodedText}`;
}

// باز کردن گفتگو و استعلام ملک در تلگرام
function inquiryTelegram(propertyId) {
  if (typeof propertiesData === 'undefined') return;
  const prop = propertiesData.find(p => p.id === propertyId);
  if (!prop) return;

  const priceStr = prop.type === 'sale' 
    ? `${prop.priceTotal} تومان` 
    : `رهن: ${prop.rentDeposit} تومان - اجاره: ${prop.rentMonthly} تومان`;

  const message = `سلام جناب آقای نجفی (مدیریت مشاور املاک آداک عالیشهر)
اینجانب مایل به استعلام و هماهنگی بازدید فایل زیر در عالیشهر هستم:
📌 کد ملک: ${prop.code}
🏢 عنوان: ${prop.shortTitle}
📍 موقعیت: ${prop.location}
💰 قیمت: ${priceStr}

لطفاً جهت بررسی وضعیت پرونده و زمان بازدید حضوری راهنمایی بفرمایید.`;

  window.open(generateTelegramLink(message), '_blank');
}

// ایجاد کارت ملکی برای نمایش در شبکه
function createPropertyCardHTML(prop) {
  const isSale = prop.type === 'sale';
  const badgeClass = isSale ? 'status-sale' : 'status-rent';
  const badgeText = isSale ? 'فروش' : 'رهن و اجاره';

  let priceHTML = '';
  if (isSale) {
    priceHTML = `
      <div class="card-price-label">قیمت کل کارشناسی شده:</div>
      <div class="card-price-value">
        <span>${prop.priceTotal}</span>
        <span class="card-price-unit">تومان</span>
      </div>
    `;
  } else {
    priceHTML = `
      <div class="rent-row">
        <span style="color: var(--text-muted); font-size: 0.8rem;">مبلغ ودیعه (رهن):</span>
        <span class="rent-amount">${prop.rentDeposit} تومان</span>
      </div>
      <div class="rent-row" style="margin-top: 4px;">
        <span style="color: var(--text-muted); font-size: 0.8rem;">اجاره ماهیانه:</span>
        <span class="rent-amount" style="color: var(--primary-hover);">${prop.rentMonthly} تومان</span>
      </div>
    `;
  }

  return `
    <article class="property-card ${!isSale ? 'rent-card' : ''}" id="card-${prop.id}">
      <div class="card-image-wrap">
        <img src="${prop.image}" alt="${prop.title}" loading="lazy" referrerpolicy="no-referrer">
        <span class="card-badge-status ${badgeClass}">${badgeText}</span>
        <span class="card-code">${prop.code}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${prop.shortTitle}</h3>
        <p class="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${prop.location}</span>
        </p>

        <div class="card-specs">
          <div class="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            <span>${toPersianDigits(prop.area)} متر</span>
          </div>
          ${prop.rooms > 0 ? `
          <div class="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>${toPersianDigits(prop.rooms)} خوابه</span>
          </div>
          ` : `
          <div class="spec-item">
            <span>${prop.phase}</span>
          </div>
          `}
          <div class="spec-item" style="margin-right: auto;">
            <span style="font-size: 0.75rem; color: #64748b;">${prop.badge || 'تخلیه'}</span>
          </div>
        </div>

        <div class="card-price-wrap">
          ${priceHTML}
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 0.85rem;">
          <a href="property.html?id=${prop.id}" class="card-action-btn" style="flex: 1;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>مشاهده جزئیات</span>
          </a>
          <button type="button" onclick="inquiryTelegram('${prop.id}')" class="card-action-btn" style="width: auto; padding: 0.6rem 0.85rem; background-color: #229ed9; color: #ffffff; border-color: #229ed9;" title="استعلام سریع در تلگرام">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-2.02 1.28-5.71 3.77-.54.37-1.03.55-1.47.54-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.41-3.64 4-.1.72-1.7.07 1.83-.07z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// راه‌اندازی منوی موبایل
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }
}

// راه‌اندازی گالری تصاویر در صفحه تک ملک
function setupGallerySwitcher() {
  const mainImage = document.getElementById('gallery-main-img');
  const captionText = document.getElementById('gallery-caption');
  const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');

  if (mainImage && thumbBtns.length > 0) {
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const newSrc = btn.getAttribute('data-full');
        const caption = btn.getAttribute('data-caption');

        if (newSrc) {
          mainImage.src = newSrc;
        }
        if (captionText && caption) {
          captionText.textContent = caption;
        }
      });
    });
  }
}

// راه‌اندازی فرم ثبت آگهی ملک (صفحه about.html / submit-property)
function setupPropertyForm() {
  const form = document.getElementById('submit-property-form');
  if (!form) return;

  // مدیریت تب‌های نوع معامله
  const dealTypeBtns = document.querySelectorAll('.deal-type-btn');
  const dealTypeInput = document.getElementById('deal-type-input');
  dealTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dealTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (dealTypeInput) {
        dealTypeInput.value = btn.getAttribute('data-value');
      }
    });
  });

  // مدیریت تب‌های نوع ملک
  const propTypeBtns = document.querySelectorAll('.property-type-btn');
  const propTypeInput = document.getElementById('property-type-input');
  propTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      propTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (propTypeInput) {
        propTypeInput.value = btn.getAttribute('data-value');
      }
    });
  });

  // کلیک روی تگ‌های سریع آدرس عالیشهر
  const quickTags = document.querySelectorAll('.quick-tag');
  const addressInput = document.getElementById('property-address');
  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      if (addressInput) {
        const text = tag.textContent.trim();
        if (!addressInput.value.includes(text)) {
          addressInput.value = addressInput.value ? `${addressInput.value}، ${text}` : text;
        }
      }
    });
  });

  // درگ اند دراپ عکس‌ها
  const dropzone = document.getElementById('photos-dropzone');
  const fileInput = document.getElementById('property-photos-input');
  const dropzoneText = document.getElementById('dropzone-text');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        if (dropzoneText) {
          dropzoneText.textContent = `${toPersianDigits(e.dataTransfer.files.length)} تصویر با موفقیت انتخاب شد`;
        }
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0 && dropzoneText) {
        dropzoneText.textContent = `${toPersianDigits(fileInput.files.length)} تصویر با موفقیت انتخاب شد`;
      }
    });
  }

  // ثبت نهایی فرم
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('owner-name')?.value || 'ناشناس';
    const phone = document.getElementById('owner-phone')?.value || '-';
    const dealType = dealTypeInput ? dealTypeInput.value : 'فروش';
    const propType = propTypeInput ? propTypeInput.value : 'آپارتمان';
    const area = document.getElementById('property-area')?.value || '-';
    const price = document.getElementById('property-price')?.value || 'توافقی';
    const address = addressInput?.value || '-';
    const desc = document.getElementById('property-desc')?.value || '-';

    const telegramMessage = `📋 ثبت آگهی جدید در مشاور املاک آداک عالیشهر
👤 مالک / متقاضی: ${name}
📞 شماره تماس: ${phone}
📑 نوع درخواست: ${dealType}
🏢 نوع ملک: ${propType}
📐 متراژ تقریبی: ${area} متر
💰 قیمت یا رهن/اجاره پیشنهادی: ${price}
📍 آدرس یا محدوده: ${address}
📝 توضیحات: ${desc}

(ارسال شده از سامانه آنلاین وب‌سایت املاک آداک عالیشهر)`;

    showToast('آگهی ملک شما با موفقیت ثبت شد! کارشناسان آداک به‌زودی تماس می‌گیرند.');

    // باز کردن تلگرام با هماهنگی
    setTimeout(() => {
      const confirmTg = confirm('آیا مایلید جزئیات آگهی را جهت بررسی فوق سریع مستقیماً به تلگرام مدیریت (نجفی) نیز بفرستید؟');
      if (confirmTg) {
        window.open(generateTelegramLink(telegramMessage), '_blank');
      }
      form.reset();
    }, 1000);
  });
}

// اشتراک‌گذاری صفحه ملک
function shareCurrentProperty() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('لینک آگهی ملک با موفقیت کپی شد.');
  }
}

// بارگذاری اولیه المان‌ها هنگام لود صفحه
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupGallerySwitcher();
  setupPropertyForm();
});
