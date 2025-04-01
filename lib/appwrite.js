import { Client, Databases, Account, Storage, Query } from 'appwrite';

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

const CATEGORY_ORDER = {
    'הקדמה והסכמות': 0,
    'תורה': 1,
    'נביאים': 2,
    'כתובים': 3
};

const BOOK_ORDER = {
    // Torah
    'בראשית': 1,
    'שמות': 2,
    'ויקרא': 3,
    'במדבר': 4,
    'דברים': 5,
    'הפטרות מיוחדות': 6,
    // Prophets
    'יהושע': 1,
    'שופטים': 2,
    'שמואל': 3,
    'מלכים': 4,
    'ישעיהו': 5,
    'ירמיהו': 6,
    'יחזקאל': 7,
    'תרי עשר': 8,
    'הפטרות מיוחדות': 9,
    // Writings
    'תהילים': 1,
    'משלי': 2,
    'איוב': 3,
    'חמש המגילות': 4,
    'דניאל': 5,
    'עזרא-נחמיה': 6,
    'דברי הימים': 7
};

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

export const listFiles = async (client) => {
    try {
        if (!client) {
            throw new Error('Client not initialized');
        }
        const databases = new Databases(client);
        let allDocuments = [];
        let offset = 0;
        const limit = 100;

        // Fetch all documents with pagination
        while (true) {
            const response = await databases.listDocuments(
                config.databaseId,
                config.collectionId,
                [
                    Query.orderAsc('categoryOrder'),
                    Query.orderAsc('bookOrder'),
                    Query.orderAsc('episodeOrder'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            if (!response || !response.documents || response.documents.length === 0) {
                break;
            }

            allDocuments = [...allDocuments, ...response.documents];
            
            if (response.documents.length < limit) {
                break;
            }
            
            offset += limit;
        }

        // Use the existing organizeBooks function to maintain the same structure
        return organizeBooks(allDocuments);
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
};

const organizeBooks = (documents) => {
    const organized = {};
    
    // First sort by category order
    const sortedDocs = documents.sort((a, b) => {
        const categoryOrderA = CATEGORY_ORDER[a.category] || 999;
        const categoryOrderB = CATEGORY_ORDER[b.category] || 999;
        if (categoryOrderA !== categoryOrderB) {
            return categoryOrderA - categoryOrderB;
        }
        
        // Then by book order
        const bookOrderA = BOOK_ORDER[a.book] || 999;
        const bookOrderB = BOOK_ORDER[b.book] || 999;
        if (bookOrderA !== bookOrderB) {
            return bookOrderA - bookOrderB;
        }
        
        // Finally by episode order
        return (a.episodeOrder || 999) - (b.episodeOrder || 999);
    });

    sortedDocs.forEach(doc => {
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