/**
 * Created by amitava on 13/05/16.
 */
module.exports = {
    analysis: {
        analyzer: {
            edge_ngram_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'edge_ngram_filter']
            },
            snowball_analyzer: {
                type:      'custom',
                tokenizer: 'standard',
                filter:    ['lowercase', 'asciifolding', 'snowball']
            }
        },
        filter: {
            edge_ngram_filter: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 20
            }
        },
        char_filter: {

        },
        tokenizer: {

        }
    }
}