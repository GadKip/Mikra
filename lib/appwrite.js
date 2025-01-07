import { Client, Databases, Account, Storage } from 'appwrite';

const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '674f0083002c2e7b3f65',
    databaseId: '674f0edb002fbcaf83a5',
    collectionId: '674f0f78000fa33cea7b',
    bucketId: '674f11d1000ef0855b2c'
};

const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export const initializeAnonymousSession = async () => {
    try {
        if (typeof window !== 'undefined') {
            try {
                // Try to get current session first
                await account.getSession('current');
                return true;
            } catch {
                // If no session exists, create anonymous session
                const session = await account.createAnonymousSession();
                console.log('Anonymous session created:', session);
                return true;
            }
        }
        return true;
    } catch (error) {
        console.error('Error initializing anonymous session:', error);
        throw error;
    }
};

export const getDocumentContent = async (id) => {
    try {
        const doc = await databases.getDocument(
            config.databaseId,
            config.collectionId,
            id
        );
        
        console.log('Document fetched:', doc);
        
        if (!doc.fileId) {
            throw new Error('No fileId found in document');
        }

        // Get the file download URL
        const fileUrl = storage.getFileDownload(
            config.bucketId,
            doc.fileId
        );
        
        // Fetch the content using the file's URL
        const response = await fetch(fileUrl.href);
        if (!response.ok) {
            throw new Error('Failed to fetch file content');
        }
        
        const content = await response.text();

        return {
            ...doc,
            content
        };
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
};

export const listFiles = async () => {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.collectionId
        );
        if (!response || !response.documents) {
            throw new Error('Invalid response format');
        }
        return organizeBooks(response.documents);
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
};

const organizeBooks = (documents) => {
    const organized = {};
    documents.forEach(doc => {
        // Check if doc has the required properties
        if (!doc.category || !doc.book || !doc.episode) {
            console.warn('Document missing required metadata:', doc);
            return;
        }
        
        const { category, book, episode } = doc;
        
        if (!organized[category]) {
            organized[category] = {};
        }
        if (!organized[category][book]) {
            organized[category][book] = [];
        }
        organized[category][book].push(doc);
    });
    return organized;
};

export { client };