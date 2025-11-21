# hotel-management

✅ 1. INSTALL GIT
1.1 Download Git
Open Chrome


Search: Git download


Or open: https://git-scm.com


Click Download


Install → Next → Next → Finish (don’t change anything)



1.2 HOW TO CHECK IF GIT IS INSTALLED
Where to check?
In Command Prompt (Windows) or Terminal (Mac).
Steps:
Open Command Prompt


Press Windows + R → type cmd → Enter


Type:

 git --version


You should see something like:

 git version 2.43.0


If you see version → Git installed
If it says “git not found” → Git is NOT installed.

✅ 2. INSTALL NODE.JS
2.1 Download Node
Open Chrome


Go to: https://nodejs.org


Click LTS version (left side)


Install → Next → Next → Finish.



2.2 HOW TO CHECK IF NODE IS INSTALLED
Where to check?
Again in Command Prompt or Terminal.
Steps:
Open CMD


Type:

 node -v
 and

 npm -v


You should see:
v18.x.x
9.x.x

If you see version numbers → Node installed successfully.
 If it says “command not found” → Node NOT installed.

✅ 3. INSTALL MONGODB
3.1 Download MongoDB
Open Chrome


Go to: https://www.mongodb.com/try/download/community


Select OS (Windows/Mac)


Click download


Install → Keep defaults → Finish.



3.2 HOW TO CHECK IF MONGODB INSTALLED
Windows:
Press Windows key


Search:

 MongoDB


If you see MongoDB Server → installed.


OR using CMD:
mongo --version

If version shows → installed.
 If not found → not installed.
Mac:
brew services list

Look for:
mongodb-community   started


✅ 4. CLONE (DOWNLOAD) THE PROJECT FROM GITHUB
4.1 Open GitHub Repository

 git@github.com:Pavi-1128/hotel-management.git


Open it in Chrome.


4.2 Copy Clone Link
Click Green “Code” button


Select SSH


Copy the link:
 Example:

         git@github.com:Pavi-1128/hotel-management.git




4.3 OPEN COMMAND PROMPT (Windows) OR TERMINAL (Mac)
Windows: Press Windows + R → type cmd → Enter


Mac: Open Terminal



4.4 Go to Desktop (recommended)
cd Desktop


4.5 CLONE THE PROJECT
Paste your GitHub link:
git clone https://github.com/yourname/hotel-booking-app.git

You should see:
Cloning into 'hotel-booking-app'...
done.

This means cloning successful.

4.6 Go inside the project folder
cd hotel-booking-app

If no error → folder exists.

✅ 5. OPEN THE PROJECT IN VS CODE
5.1 Install VS Code
Download from: https://code.visualstudio.com
Install → Finish.

5.2 How to open project in VS Code
Open VS Code


Click File → Open Folder


Select folder:


hotel-booking-app

Click Open


VS Code will show the project files.

✅ 6. INSTALL PROJECT DEPENDENCIES
In VS Code → open terminal:
npm install

How to check if installed?
You should see messages like:
added 300 packages

And no red errors.

MONGO_URI=mongodb://localhost:27017/hotelbooking
JWT_SECRET=your_secret_key

Save.

✅ 7. START MONGODB DATABASE
Windows:
Press Windows key


Search:

 Services


Open Services


Find MongoDB Server


Click Start


Mac:
brew services start mongodb-community

How to check if MongoDB is running?
Run:
mongo

If you see something like:
MongoDB shell version x.x.x

→ MongoDB is running.

✅ 8. RUN THE BACKEND SERVER
In VS Code terminal:
npm start

or
npm run dev


✅ 9. OPEN SWAGGER API DOCUMENTATION
Open Chrome → type:
http://localhost:3001/api-docs

If Swagger opens → setup successful.

🎯 SUMMARY (WHAT TO CHECK)
Step
What to check
Git install
git --version shows version
Node install
node -v & npm -v show version
MongoDB install
mongo --version or MongoDB service visible
Git clone
Folder downloaded without error
VS Code open
Project files visible
npm install
No errors in terminal
Server start
Server running + MongoDB connected
Swagger
Opens in browser


