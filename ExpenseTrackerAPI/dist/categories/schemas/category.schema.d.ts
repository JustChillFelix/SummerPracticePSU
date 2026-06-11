import { Document } from 'mongoose';
export type CategoryDocument = Category & Document;
export declare class Category {
    name: string;
    color: string;
}
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, any, any, Category>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, Document<unknown, {}, Category, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Category & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Category, Document<unknown, {}, Category, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Category & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    color?: import("mongoose").SchemaDefinitionProperty<string, Category, Document<unknown, {}, Category, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Category & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Category>;
