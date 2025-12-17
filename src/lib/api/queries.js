export const PAGE_CONTENT_QUERY = {
  populate: {
    content: {
      on: {
        'custom.hero': {
          populate: { heroImage: true }
        },
        'custom.features': {
          populate: {
            featuresCard: {
              populate: { icon: true, button: true }
            },
            button: '*'
          }
        },
        'custom.our-work': {
          populate: {
            portfolioCard: {
              populate: { image: true }
            }
          }
        },
        'custom.performance': {
          populate: {
            image: true,
            stat: true,
            button: '*',
            bulletPoint: {
              populate: { lightIcon: true, darkIcon: true }
            }
          }
        },
        'custom.testimonials': {
          populate: {
            testimonialCards: {
              populate: { lightIcon: true, darkIcon: true }
            }
          }
        },
        'custom.about-section': {
          populate: {
            bulletPoint: {
              populate: { lightIcon: true, darkIcon: true }
            },
            image: true,
            button: '*'
          }
        },
        'custom.business-section': {
          populate: {
            bulletPoint: {
              populate: { lightIcon: true, darkIcon: true }
            },
            sliderImages: true,
            button: '*'
          }
        },
        'custom.pricing' : {
          populate: {
            card: {
              populate: { 
                bulletPoint: {
                  populate: { lightIcon: true, darkIcon: true }
                },
                cta: true,
              }
            }
          }
        }
      }
    }
  }
};
