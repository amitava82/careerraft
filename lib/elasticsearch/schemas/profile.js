/**
 * Created by amitava on 18/04/16.
 */
module.exports = {
    profile: {
        properties: {
            name: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            short_description: {
                type: 'string'
            },
            url_slug: {
                type: 'string',
                index: 'not_analyzed'
            },
            address: {
                properties: {
                    locality: {
                        type: 'string',
                        fields: {
                            raw: {
                                index: 'not_analyzed',
                                type: 'string'
                            }
                        }
                    },
                    city: {
                        type: 'string'
                    },
                    state: {
                        type: 'string'
                    },
                    pincode: {
                        type: 'string'
                    }
                }
            },
            location: {
                type: 'geo_point',
                index: 'not_analyzed'
            },
            kind: {
                type: 'string',
                index: 'not_analyzed'
            },
            provider_id: {
                type: 'string',
                index: 'not_analyzed'
            },
            courses: {
                properties: {
                    name: {
                        type: 'string',
                        analyzer: 'edge_ngram_analyzer',
                        fields: {
                            raw: {
                                index: 'not_analyzed',
                                type: 'string'
                            }
                        }
                    },
                    category: {
                        type: 'string',
                        fields: {
                            raw: {
                                index: 'not_analyzed',
                                type: 'string'
                            }
                        }
                    },
                    course_id: {
                        type: 'string',
                        index: 'not_analyzed'
                    },
                    category_id:{
                        type: 'string',
                        index: 'not_analyzed'
                    }
                }
            },
            status: {
                type: 'string',
                index: 'not_analyzed'
            },
            experience: {
                type: 'integer'
            }
        }
    }
};