module.exports = {
    fields:{
        id: {
            type: "uuid",
            default: { "$db_function": "uuid()" }
        },
        first_name    : "text",
        last_name : "text",
        email     : "text"
    },
    key:["id"],
    table_name: "users",
    indexes: ["email"],
    materialized_views: {
        users_descending: {
            select: ["id","email","first_name","last_name"],
            key : ["id","email"],
        }
    },
}