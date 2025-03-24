# SkillSwap

## Firebase Configuration

### Setting up Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the downloaded JSON file as `config/serviceAccountKey.json`

**Important**: Never commit the `serviceAccountKey.json` file to version control. A template file `serviceAccountKey.template.json` is provided for reference.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

## Development

```bash
npm run dev
```