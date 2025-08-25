import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

// defining appwrite client to set endpoint and project id
const client = new Client().setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)

// to define DB
const database = new Databases(client);

// update a search count using appwrite db
export const updateSearchCount = async (searchTerm, movie) => {
    // console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID)
    // use appwrite sdk to update the search count and to check if the search term exists in the DB
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm),])

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { count: doc.count + 1 })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                })
        }
    } catch (error) {
        console.error(error)
    }
    // if not, create new document with the search term and count



}