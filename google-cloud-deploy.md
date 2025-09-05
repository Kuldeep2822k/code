# 🚀 Deploy on Google Cloud Platform

## 🌟 Option 1: Google Cloud Storage (Recommended - Easiest)

### Prerequisites
1. **Google Account**: You need a Gmail account
2. **Google Cloud Console**: Access to https://console.cloud.google.com
3. **Billing**: Enable billing (Google gives $300 free credit for new users)

### Step-by-Step Deployment

#### Step 1: Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `indian-meal-calculator`
4. Click **"Create"**

#### Step 2: Enable Cloud Storage API
1. In the search bar, type: `Cloud Storage`
2. Click on **"Cloud Storage"**
3. Click **"Enable"** if not already enabled

#### Step 3: Create a Storage Bucket
1. Click **"Create Bucket"**
2. **Name**: `indian-meal-calculator-website` (must be globally unique)
3. **Location**: Choose closest to your users (e.g., `us-central1`)
4. **Storage Class**: `Standard`
5. **Access Control**: `Uniform`
6. Click **"Create"**

#### Step 4: Upload Your Files
1. Click on your bucket name
2. Click **"Upload Files"**
3. Select all your files:
   - `index.html`
   - `script.js`
   - `styles.css`
   - `README.md`
4. Click **"Upload"**

#### Step 5: Make Bucket Public
1. Click on **"Permissions"** tab
2. Click **"Add"**
3. **New members**: `allUsers`
4. **Role**: `Storage Object Viewer`
5. Click **"Save"**

#### Step 6: Set Main Page
1. Click on **"Objects"** tab
2. Click on **"Edit"** (pencil icon) next to `index.html`
3. **Content-Type**: `text/html`
4. Click **"Update"**

#### Step 7: Get Your Website URL
Your website will be available at:
```
https://storage.googleapis.com/[BUCKET-NAME]/index.html
```

**Example**: `https://storage.googleapis.com/indian-meal-calculator-website/index.html`

## 🌟 Option 2: Google App Engine (Advanced)

### Step 1: Install Google Cloud CLI
1. Download from: https://cloud.google.com/sdk/docs/install
2. Run installer and follow setup

### Step 2: Create app.yaml
Create a file called `app.yaml` in your project folder:

```yaml
runtime: python39
handlers:
- url: /
  static_files: index.html
  upload: index.html
- url: /(.*)
  static_files: \1
  upload: .*
```

### Step 3: Deploy
```bash
gcloud app deploy
```

Your site will be at: `https://[PROJECT-ID].appspot.com`

## 🌟 Option 3: Firebase Hosting (Google's Web Hosting)

### Step 1: Go to Firebase
1. Visit: https://firebase.google.com
2. Click **"Get started"**
3. Sign in with your Google account

### Step 2: Create Project
1. Click **"Create a project"**
2. Name: `indian-meal-calculator`
3. Follow setup wizard

### Step 3: Add Web App
1. Click **"Web"** icon
2. Register app with name: `indian-meal-calculator`
3. Click **"Register app"**

### Step 4: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 5: Deploy
```bash
firebase login
firebase init hosting
firebase deploy
```

## 💰 Cost Estimation

### Google Cloud Storage
- **Storage**: ~$0.02/GB/month (your site is tiny, so ~$0.01/month)
- **Bandwidth**: $0.12/GB (first 1GB free)
- **Total**: Usually under $1/month for small traffic

### Google Cloud Free Tier
- **New users get $300 free credit**
- **90 days to use it**
- **Perfect for testing and small projects**

## 🔧 Troubleshooting

### Common Issues
1. **Bucket name not unique**: Add numbers/random chars
2. **Files not showing**: Check permissions are set to public
3. **404 errors**: Make sure `index.html` is uploaded first

### Support
- **Google Cloud Documentation**: https://cloud.google.com/storage/docs/hosting-static-website
- **Community**: https://stackoverflow.com/questions/tagged/google-cloud-platform

## 🎯 Benefits of Google Cloud

✅ **Professional hosting** with Google's infrastructure
✅ **Global CDN** for fast loading worldwide
✅ **Scalable** - handles any amount of traffic
✅ **Secure** - HTTPS by default
✅ **Analytics** - track visitors and performance
✅ **Custom domains** - use your own domain name

---

**Ready to deploy?** Start with Option 1 (Cloud Storage) - it's the easiest!



