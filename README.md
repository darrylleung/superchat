# Chatroom Demo

Live site: https://darryl-firechat-desktop.web.app/

## Overview

This chatroom application was built using React and Firebase. The demo was originally created by [Fireship](https://fireship.io/lessons/react-firebase-chat-app-tutorial/). 

The application uses Firebase's Authentication, Firestore Database, and Hosting. It allows for realtime chat without the use of HTTP requests.

Users log-in with their Google user accounts for authentication. The chatroom utilizes `react-firebase-hooks` `useCollectionData` hook to query the Firestore database and listen for changes to the data in realtime. Chat messages are collected in a form and submitted to Firestore. New messages are instantly loaded and the chat auto-scrolls to see the latest message.

For security, the Firestore Database is set up with rules to ensure that users are signed-in, creating a document that matches their UID, using less than the maximum number of characters, and is not banned.

Users are banned automatically if they use a word found on the `bad-words` filter. The banned users' UID is added to the `banned` collection in the Firestore Database, which is checked everytime a user attempts to write to the database.