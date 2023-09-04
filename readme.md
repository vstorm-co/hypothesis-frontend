# Annotation Project - Frontend

This is the frontend for a Annotation Project interact with the OpenAI API through the `annotation-backend` The project is built using the Preact framework and was initialized with Vite for quick development setup.

## Getting Started

To get started with this project, follow the instructions below:

1. **Clone the Repository:**

   ```
   git clone https://github.com/vstorm-co/annotation-frontend
   ```

2. **Navigate to the Project Directory:**

   ```
   cd hypothesis-frontend
   ```

3. **Install Dependencies:**

   ```
   npm install
   ```

4. **Configuration:**

   Before you can start using the custom user interface, you need to configure it to work with your `hypothesis-backend` API and OpenAI credentials. To do this, open the `.env` file in the project root and set the following variables:

   - `VITE_API_URL`: The URL of your `hypothesis-backend` API.
   - `VITE_WS_URL`: The URL of your `hypothesis-backend` WebSocket.
   - `VITE_GOOGLE_CLIENT_ID`: The Google ClientId for Google accounts authorization

5. **Run the Development Server:**

   ```
   npm run dev
   ```

6. **Open the Application:**

   Once the development server is running, open your web browser and navigate to [http://localhost:5137](http://localhost:5137) to access the app.

## Usage

This frontend provides a user-friendly interface for interacting with the OpenAI API through the `hypothesis-backend` API. You can use it to create various Chats with OpenAI requests, such as generating text or conducting language tasks, and view the responses in real-time. Share those chats with other users and create templates of request to reuse them in future requests