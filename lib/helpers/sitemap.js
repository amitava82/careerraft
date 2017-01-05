/**
 * Created by amitava on 04/03/16.
 */
var sm = require('sitemap');
module.exports = function (deps) {

    return {
        generateInstitutesSitemap(){
            const sitemap = sm.createSitemap ({
                hostname: 'http://www.educationalley.in',
                cacheTime: 600000,        // 600 sec - cache purge period
                urls: []
            });
            return deps.models.Organization.find({}).select('url_slug').lean().then(
                orgs => {
                    orgs.forEach(i => {
                        if(i.url_slug)
                            sitemap.add({
                                url: `/institute/${i.url_slug}`,
                                changefreq: 'weekly',
                                priority: 1
                            });
                    });
                    return sitemap;
                }
            )
        },

        generatecategorySitemap(){
            const sitemap = sm.createSitemap ({
                hostname: 'http://www.educationalley.in',
                cacheTime: 600000,        // 600 sec - cache purge period
                urls: []
            });
            return deps.models.Category.find({}).select('_id').lean().then(
                cats => {
                    cats.forEach(i => {
                        sitemap.add({
                            url: `/categories/${i._id.toString()}`,
                            changefreq: 'weekly',
                            priority: .8
                        });
                    });
                    return sitemap;
                }
            )
        },

        //generateCourseSitemap(){
        //    const sitemap = sm.createSitemap ({
        //        hostname: 'http://www.careerraft.com',
        //        cacheTime: 600000,        // 600 sec - cache purge period
        //        urls: []
        //    });
        //    return deps.models.Course.find({}).select('_id, category').lean().then(
        //        courses => {
        //            courses.forEach(i => {
        //                sitemap.add({
        //                    url: `/categories/${i.category}/${i._id.toString()}`,
        //                    changefreq: 'weekly',
        //                    priority: .8
        //                });
        //            });
        //            return sitemap;
        //        }
        //    )
        //}
    }
};