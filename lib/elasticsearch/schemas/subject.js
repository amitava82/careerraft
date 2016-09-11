/**
 * Created by amitava on 18/04/16.
 */
module.exports = {
    subject: {
        properties: {
            name: {
                type: 'multi_field',
                fields: {
                    name: {
                        type: 'string'
                    },
                    ngrams: {
                        type: 'string',
                        analyzer: 'edge_ngram_analyzer'
                    },
                    stemmed: {
                        type: 'string',
                        analyzer: 'snowball_analyzer'
                    }
                }
            },
            category: {
                type: 'string',
                index: 'not_analyzed'
            },
            course: {
                type: 'string',
                index: 'not_analyzed'
            }
        }
    }
};