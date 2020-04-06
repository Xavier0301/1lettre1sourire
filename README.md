# 1lettre1sourire
Infrastructure used by 1lettre1sourire.org to automate letter reviews.

# How it's build
 - express for the backend
 - html/css for the frontend
 - MongoDB as the database
 
# Installation guide
The prerequisites for the installation (we will add better guidance later):
 - install LibreOffice 
 - install PDFtk  
 - install MongoDB and have it running on the same server 
 - npm install and npm start to run the server
 
The server is built such that the letters should be received via a POST endpoint (located at /api/letters/add)
