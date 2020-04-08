# 1lettre1sourire
Server used by 1lettre1sourire.org to automate letter reviews.

# How it's built
 - express for the backend
 - html/css for the frontend
 - MongoDB as the database
 
# Installation guide
The prerequisites for the installation (we will add better guidance later):
 - install LibreOffice 
 - install PDFtk  
 - install MongoDB and have it running on the same server 
 - npm install and npm start to run the server
 - optionally install the Eido font at https://lpc.univ-amu.fr/fr/police-caracteres-eido
 
The server is built such that the letters should be received via a POST endpoint (located at /api/letters/add)
