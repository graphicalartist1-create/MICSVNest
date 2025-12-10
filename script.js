// ============================
// DOM Elements
// ============================

const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const previewSection = document.getElementById('previewSection');
const metadataSection = document.getElementById('metadataSection');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

const imagePreview = document.getElementById('imagePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileType = document.getElementById('fileType');

const imgWidth = document.getElementById('imgWidth');
const imgHeight = document.getElementById('imgHeight');
const imgRatio = document.getElementById('imgRatio');
const pixelDensity = document.getElementById('pixelDensity');

const dominantColor = document.getElementById('dominantColor');
const dominantColorText = document.getElementById('dominantColorText');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');

const totalPixels = document.getElementById('totalPixels');
const colorDepth = document.getElementById('colorDepth');
const estimatedDPI = document.getElementById('estimatedDPI');
const creationTime = document.getElementById('creationTime');

// Input Elements
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const keywordsList = document.getElementById('keywordsList');

// Buttons
const copyTitle = document.getElementById('copyTitle');
const copyDescription = document.getElementById('copyDescription');
const copyKeywords = document.getElementById('copyKeywords');
const downloadJSON = document.getElementById('downloadJSON');
const regenerateBtn = document.getElementById('regenerateBtn');
const resetBtn = document.getElementById('resetBtn');

// ============================
// State Management
// ============================

let currentImageData = {
    file: null,
    width: 0,
    height: 0,
    dominantColor: null,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    colorData: null
};

// ============================
// Event Listeners
// ============================

// File input change
imageInput.addEventListener('change', handleFileSelect);

// Drag and drop
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);

// Copy buttons
copyTitle.addEventListener('click', copyToClipboard);
copyDescription.addEventListener('click', copyToClipboard);
copyKeywords.addEventListener('click', copyToClipboard);

// Action buttons
downloadJSON.addEventListener('click', downloadMetadataJSON);
regenerateBtn.addEventListener('click', regenerateMetadata);
resetBtn.addEventListener('click', resetForm);

// ============================
// File Upload Handlers
// ============================

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    } else {
        showError('অনুগ্রহ করে একটি বৈধ ছবি ফাইল আপলোড করুন');
    }
}

// ============================
// Image Processing
// ============================

function processImage(file) {
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showError('সমর্থিত ফরম্যাট: JPG, PNG, GIF, WebP');
        return;
    }

    currentImageData.file = file;

    // Display file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileType.textContent = file.type || 'Unknown';

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewSection.style.display = 'block';

        // Analyze image
        const img = new Image();
        img.onload = () => {
            analyzeImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    hideError();
}

function analyzeImage(img) {
    // Basic properties
    const width = img.width;
    const height = img.height;
    const ratio = (width / height).toFixed(2);

    currentImageData.width = width;
    currentImageData.height = height;

    imgWidth.textContent = `${width}px`;
    imgHeight.textContent = `${height}px`;
    imgRatio.textContent = ratio;
    pixelDensity.textContent = `${Math.round(Math.sqrt(width * width + height * height))}px`;

    // Calculate color data
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Analyze colors
    analyzeColors(data, width, height);

    // Display metadata
    metadataSection.style.display = 'block';

    // Generate keywords
    generateKeywords(width, height);

    // Generate initial title and description
    const filename = currentImageData.file.name.replace(/\.[^/.]+$/, '');
    titleInput.value = generateSmartTitle(filename, width, height);
    descriptionInput.value = generateSmartDescription(width, height, currentImageData.brightness, currentImageData.saturation);

    showSuccess('✅ ছবি সফলভাবে বিশ্লেষণ করা হয়েছে! শিরোনাম এবং বর্ণনা স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।');
    setTimeout(hideSuccess, 3000);
}

function analyzeColors(pixelData, width, height) {
    let r = 0, g = 0, b = 0;
    let minR = 255, minG = 255, minB = 255;
    let maxR = 0, maxG = 0, maxB = 0;
    let count = 0;

    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < pixelData.length; i += 16) {
        const red = pixelData[i];
        const green = pixelData[i + 1];
        const blue = pixelData[i + 2];

        r += red;
        g += green;
        b += blue;

        minR = Math.min(minR, red);
        minG = Math.min(minG, green);
        minB = Math.min(minB, blue);

        maxR = Math.max(maxR, red);
        maxG = Math.max(maxG, green);
        maxB = Math.max(maxB, blue);

        count++;
    }

    // Calculate averages
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    const dominantRgb = `rgb(${r}, ${g}, ${b})`;
    const hexColor = rgbToHex(r, g, b);

    currentImageData.dominantColor = hexColor;
    dominantColor.style.backgroundColor = dominantRgb;
    dominantColorText.textContent = hexColor;

    // Calculate brightness (0-100)
    const br = Math.round((r + g + b) / 3);
    currentImageData.brightness = Math.round((br / 255) * 100);
    brightness.textContent = `${currentImageData.brightness}%`;

    // Calculate contrast (0-100)
    const contrastValue = Math.round(
        (((maxR - minR) + (maxG - minG) + (maxB - minB)) / 3 / 255) * 100
    );
    currentImageData.contrast = contrastValue;
    contrast.textContent = `${contrastValue}%`;

    // Calculate saturation
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const saturationValue = maxC === minC ? 0 : Math.round(((maxC - minC) / (255 - minC)) * 100);
    currentImageData.saturation = saturationValue;
    saturation.textContent = `${saturationValue}%`;

    // Technical info
    totalPixels.textContent = formatNumber(width * height);
    colorDepth.textContent = '24-bit (8-bit per channel)';
    estimatedDPI.textContent = '72 DPI (estimated)';
    creationTime.textContent = new Date().toLocaleString('bn-BD');
}

// ============================
// Utility Functions
// ============================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// ============================
// Keyword Generation
// ============================

function generateKeywords(width, height) {
    const keywords = [];

    // Size-based keywords
    if (width > 2000 || height > 2000) {
        keywords.push('উচ্চ রেজোলিউশন', 'বড় ছবি', '4K');
    } else if (width > 1000 || height > 1000) {
        keywords.push('মাঝারি রেজোলিউশন', 'এইচডি ছবি');
    } else {
        keywords.push('ছোট ছবি', 'কম রেজোলিউশন');
    }

    // Ratio-based keywords
    const ratio = width / height;
    if (ratio > 1.3) {
        keywords.push('ল্যান্ডস্কেপ', 'প্যানোরামিক');
    } else if (ratio < 0.77) {
        keywords.push('পোর্ট্রেট', 'লম্বা ছবি');
    } else {
        keywords.push('স্কোয়ার', 'ভারসাম্যপূর্ণ');
    }

    // Brightness-based keywords
    if (currentImageData.brightness > 75) {
        keywords.push('উজ্জ্বল', 'হালকা', 'উচ্চ কী');
    } else if (currentImageData.brightness < 25) {
        keywords.push('অন্ধকার', 'কম কী', 'রাত্রিকালীন');
    } else {
        keywords.push('সুষম আলো');
    }

    // Saturation-based keywords
    if (currentImageData.saturation > 70) {
        keywords.push('প্রাণবন্ত', 'রঙিন', 'যোগাযোগপূর্ণ');
    } else if (currentImageData.saturation < 30) {
        keywords.push('মেকি', 'নিরপেক্ষ', 'কম রঙ');
    }

    // Contrast-based keywords
    if (currentImageData.contrast > 70) {
        keywords.push('উচ্চ কন্ট্রাস্ট', 'নাটকীয়', 'তীক্ষ্ণ');
    } else if (currentImageData.contrast < 30) {
        keywords.push('কম কন্ট্রাস্ট', 'নরম', 'মধ্যম');
    }

    // Color-based keywords
    const color = hexToRgb(currentImageData.dominantColor);
    if (color) {
        if (color.r > color.g && color.r > color.b) {
            keywords.push('লাল', 'উষ্ণ টোন');
        } else if (color.g > color.r && color.g > color.b) {
            keywords.push('সবুজ', 'প্রকৃতি', 'তাজা');
        } else if (color.b > color.r && color.b > color.g) {
            keywords.push('নীল', 'শীতল টোন', 'প্রশান্ত');
        }
    }

    // Display keywords
    displayKeywords(keywords);
}

function displayKeywords(keywords) {
    keywordsList.innerHTML = '';
    keywords.forEach((keyword) => {
        const span = document.createElement('span');
        span.className = 'keyword';
        span.textContent = keyword;
        keywordsList.appendChild(span);
    });
}

// ============================
// Action Functions
// ============================

function copyToClipboard(e) {
    const button = e.target.closest('.btn-copy');
    let textToCopy = '';
    let successMessage = '';

    if (button === copyTitle) {
        textToCopy = titleInput.value;
        successMessage = '📋 শিরোনাম ক্লিপবোর্ডে কপি হয়েছে!';
    } else if (button === copyDescription) {
        textToCopy = descriptionInput.value;
        successMessage = '📋 বর্ণনা ক্লিপবোর্ডে কপি হয়েছে!';
    } else if (button === copyKeywords) {
        textToCopy = Array.from(keywordsList.querySelectorAll('.keyword'))
            .map(k => k.textContent)
            .join(', ');
        successMessage = '📋 কীওয়ার্ড ক্লিপবোর্ডে কপি হয়েছে!';
    }

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showSuccess(successMessage);
            setTimeout(hideSuccess, 2500);
        }).catch(() => {
            showError('❌ কপি করতে ব্যর্থ হয়েছে। আপনার ব্রাউজার এই ফিচার সাপোর্ট নাও করতে পারে।');
        });
    }
}

function downloadMetadataJSON() {
    const metadata = {
        file: {
            name: currentImageData.file.name,
            size: currentImageData.file.size,
            type: currentImageData.file.type,
            sizeFormatted: formatFileSize(currentImageData.file.size)
        },
        dimensions: {
            width: currentImageData.width,
            height: currentImageData.height,
            ratio: (currentImageData.width / currentImageData.height).toFixed(2),
            totalPixels: currentImageData.width * currentImageData.height
        },
        colors: {
            dominant: currentImageData.dominantColor,
            brightness: currentImageData.brightness,
            contrast: currentImageData.contrast,
            saturation: currentImageData.saturation
        },
        technical: {
            colorDepth: '24-bit',
            estimatedDPI: '72 DPI',
            creationTime: new Date().toISOString()
        },
        keywords: Array.from(keywordsList.querySelectorAll('.keyword')).map(k => k.textContent)
    };

    const dataStr = JSON.stringify(metadata, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metadata-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showSuccess('মেটাডেটা JSON হিসাবে ডাউনলোড হয়েছে!');
    setTimeout(hideSuccess, 3000);
}

function generateMetadataText() {
    return `
ছবির মেটাডেটা তথ্য
================================
ফাইলের তথ্য:
- নাম: ${fileName.textContent}
- সাইজ: ${fileSize.textContent}
- টাইপ: ${fileType.textContent}

মাপ এবং রেজোলিউশন:
- প্রস্থ: ${imgWidth.textContent}
- উচ্চতা: ${imgHeight.textContent}
- অনুপাত: ${imgRatio.textContent}
- মোট পিক্সেল: ${totalPixels.textContent}

রঙ এবং প্রভাব:
- প্রভাবশালী রঙ: ${dominantColorText.textContent}
- উজ্জ্বলতা: ${brightness.textContent}
- কন্ট্রাস্ট: ${contrast.textContent}
- স্যাচুরেশন: ${saturation.textContent}

প্রযুক্তিগত তথ্য:
- রঙের গভীরতা: ${colorDepth.textContent}
- অনুমানিত DPI: ${estimatedDPI.textContent}
- সৃষ্টির সময়: ${creationTime.textContent}

স্বয়ংক্রিয় কীওয়ার্ড:
${Array.from(keywordsList.querySelectorAll('.keyword')).map(k => '- ' + k.textContent).join('\n')}
    `.trim();
}

function generateMockMetadata() {
    // এই ফাংশনটি একটি নকল AI API রেসপন্স সিমুলেট করে
    const filename = currentImageData.file.name.replace(/\.[^/.]+$/, '');
    const title = generateSmartTitle(filename, currentImageData.width, currentImageData.height);
    const description = generateSmartDescription(
        currentImageData.width,
        currentImageData.height,
        currentImageData.brightness,
        currentImageData.saturation
    );
    
    // Mock API response with title, description, and keywords
    return {
        title: title,
        description: description,
        keywords: Array.from(keywordsList.querySelectorAll('.keyword')).map(k => k.textContent)
    };
}

function regenerateMetadata() {
    if (currentImageData.file) {
        // Mock API call to generate metadata
        showSuccess('⏳ মেটাডেটা তৈরি করছি...');
        
        // Simulate AI processing delay
        setTimeout(() => {
            // Clear existing inputs
            titleInput.value = '';
            descriptionInput.value = '';
            keywordsList.innerHTML = '';

            // Regenerate keywords based on image properties
            generateKeywords(currentImageData.width, currentImageData.height);

            // Get mock metadata
            const metadata = generateMockMetadata();
            
            // Update UI with generated metadata
            titleInput.value = metadata.title;
            descriptionInput.value = metadata.description;

            showSuccess('✅ মেটাডেটা সফলভাবে তৈরি হয়েছে!');
            setTimeout(hideSuccess, 2500);
        }, 800);
    } else {
        showError('প্রথমে একটি ছবি আপলোড করুন');
    }
}

function generateSmartTitle(filename, width, height) {
    const words = filename.split(/[-_\s]+/).filter(w => w.length > 0);
    const sizeDescriptor = width > 2000 || height > 2000 ? 'উচ্চ মানের ' : '';
    const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${sizeDescriptor}${capitalizedWords}`;
}

function generateSmartDescription(width, height, brightness, saturation) {
    const resolutionDesc = width > 2000 || height > 2000 ? 'উচ্চ রেজোলিউশনের' : width > 1000 || height > 1000 ? 'মাঝারি রেজোলিউশনের' : 'কম রেজোলিউশনের';
    const ratio = (width / height).toFixed(2);
    const orientationDesc = ratio > 1.3 ? 'ল্যান্ডস্কেপ' : ratio < 0.77 ? 'পোর্ট্রেট' : 'স্কোয়ার';
    
    let lightingDesc = '';
    if (brightness > 75) {
        lightingDesc = 'উজ্জ্বল এবং হালকা';
    } else if (brightness < 25) {
        lightingDesc = 'অন্ধকার এবং রহস্যময়';
    } else {
        lightingDesc = 'সুষম এবং পরিষ্কার';
    }

    let colorDesc = '';
    if (saturation > 70) {
        colorDesc = 'প্রাণবন্ত এবং অত্যন্ত রঙিন';
    } else if (saturation < 30) {
        colorDesc = 'নরম এবং নিরপেক্ষ টোনের';
    } else {
        colorDesc = 'সুষম এবং আকর্ষণীয় রঙের';
    }

    const description = `এই ${resolutionDesc}, ${orientationDesc} ছবিটি ${width}x${height} পিক্সেল রেজোলিউশনে তৈরি করা হয়েছে। ছবিটি ${lightingDesc} আলোতে শ্যুট করা হয়েছে এবং এটি একটি ${colorDesc} চিত্র যা দর্শকদের দৃষ্টি আকর্ষণ করতে পারে। এই ছবিটি ওয়েব, সোশ্যাল মিডিয়া এবং প্রিন্ট মিডিয়ার জন্য আদর্শ।`;
    
    return description;
}

function resetForm() {
    imageInput.value = '';
    previewSection.style.display = 'none';
    metadataSection.style.display = 'none';
    titleInput.value = '';
    descriptionInput.value = '';
    keywordsList.innerHTML = '';
    currentImageData = {
        file: null,
        width: 0,
        height: 0,
        dominantColor: null,
        brightness: 0,
        contrast: 0,
        saturation: 0,
        colorData: null
    };
    hideError();
    hideSuccess();
    showSuccess('🔄 ফর্ম সম্পূর্ণভাবে রিসেট হয়েছে');
    setTimeout(hideSuccess, 2500);
}

// ============================
// Message Display
// ============================

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

function hideSuccess() {
    successMessage.style.display = 'none';
}

// ============================
// Initialize
// ============================

console.log('🎨 ছবির মেটাডেটা জেনারেটর লোড হয়েছে');
