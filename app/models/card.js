exports.definition = {
	config: {
		columns: {
		    "card_id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "card_title":"TEXT",
		    "card_description":"TEXT",
		    "card_url":"TEXT",
		    "card_date_reminder":"NUMERIC",
		    "card_finished":"INTEGER",
		    "group_id":"INTEGER DEFAULT 0 REFERENCES groups(group_id) ON DELETE SET DEFAULT"		    
		},
		adapter: {
			type: "sql",
			collection_name: "cards",
			idAttribute: "card_id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};
