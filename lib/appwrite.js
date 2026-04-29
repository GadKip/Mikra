import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

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

export const getDocumentContent = async (id) => {
    try {
        const docRef = doc(db, 'episodes', id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error('Document not found');
        }
        
        const data = docSnap.data();
        
        // Safely parse content - handle both string and object formats
        let content = data.content;
        if (typeof content === 'string') {
            try {
                content = JSON.parse(content);
            } catch (parseError) {
                console.warn('Failed to parse content as JSON, returning as-is:', parseError);
            }
        }
                    
        return {
            ...data,
            content,
            episode: data.title,
            $id: docSnap.id
        };
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
};

export const listFiles = async () => {
    try {
        const episodesRef = collection(db, 'episodes');
        const q = query(
            episodesRef,
            orderBy('categoryOrder'),
            orderBy('bookOrder'),
            orderBy('episodeOrder')
        );
        
        const querySnapshot = await getDocs(q);
        const documents = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Safely handle content - only parse if it's a string
            let finalContent = data.content;
            if (typeof finalContent === 'string') {
                try {
                    finalContent = JSON.parse(finalContent);
                } catch (parseError) {
                    console.warn(`Failed to parse content for doc ${doc.id}, keeping as-is:`, parseError);
                }
            }

            const dateIso = data.uploadedAt?.toDate ? data.uploadedAt.toDate().toISOString() : new Date().toISOString();

            documents.push({
                ...data,
                content: finalContent,
                $id: doc.id,
                id: doc.id,
                episode: data.title,
                $createdAt: dateIso,
                $updatedAt: dateIso,
                $permissions: data.$permissions || [],
                $collectionId: 'episodes',
                $databaseId: 'mikra-db'
            });
        });
        
        console.log(`✅ Loaded ${documents.length} episodes. First on the list:`, documents[0]?.title);
        
        return organizeBooks(documents);
        
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
