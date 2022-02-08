class Serializer {
    constructor() {
        this.types = [];
    }

    addType(classType, serializeFunction, deserializeFunction) {
        this.types.push({
            classType: classType,
            serializeFn: Serializer.createSerializeFunction(classType, serializeFunction),
            deserializeFn: deserializeFunction || Serializer.createDeserializeFunction(classType),
        });
    }

    serialize(obj) {
		return btoa(JSON.stringify(obj, (k, v) => {
            for (const t of this.types) {
                if (v instanceof t.classType) {
                    return t.serializeFn(k, v);
                }
            }
            return v;
		}));
    }

    deserialize(s) {
        return JSON.parse(atob(s), (k, v) => {
            if (typeof v === "object" && v !== null) {
                for (const t of this.types) {
                    if (v.type === t.classType.name) {
                        return t.deserializeFn(k, v.data);
                    }
                }
            }
            return v;
        });
    }
}

Serializer.createSerializeFunction = function(classType, serializeFn) {
    const useSerializerFn = serializeFn || ((_, v) => Object.assign({}, v));
    return function(k, v) {
        return {
            type: classType.name,
            data: useSerializerFn(k, v),
        };
    }
}

Serializer.createDeserializeFunction = function(classType) {
    return function(_, v) {
        return Object.assign(new classType(), v);
    }
}
