const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const multer = require('multer');

const app = express();
const PORT = 3000;

// --- Configuration ---
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

app.engine('html', engine({
    extname: '.html',
    defaultLayout: 'base',
    layoutsDir: path.join(__dirname, 'src/layouts'),
    partialsDir: path.join(__dirname, 'src/components'),
    helpers: {
        section: function(name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        },
        eq: (a, b) => a === b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        times: function(n, block) {
            var accum = [];
            for(var i = 0; i < n; ++i)
                accum.push(i);
            return accum;
        },
        startsWith: (str, prefix) => (typeof str === 'string' && typeof prefix === 'string') ? str.startsWith(prefix) : false,
    }
}));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src/pages'));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './src/assets/images/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'src/assets/images/uploads')));

// --- Data ---
const courseCategories = [
    { name: "برمجة", slug: "programming" },
    { name: "تصميم", slug: "design" },
    { name: "تسويق", slug: "marketing" }
];

const demoCourses = [
    { 
        slug: 'web-ui-basics', 
        image: 'https://placehold.co/600x400/3b82f6/ffffff?text=تطوير+الويب', 
        category: 'برمجة', 
        categoryClass: 'programming', 
        title: 'أساسيات تطوير واجهات الويب', 
        description: 'تعلم HTML, CSS, و JavaScript لبناء مواقع وتطبيقات ويب تفاعلية.', 
        price: 'ضمن الخطة الاحترافية', 
        tier: 'pro', 
        rating: '4.8', 
        instructor: 'أحمد علي', 
        instructorAvatar: '/assets/images/avatar-1.jpg',
        lessons: 24, 
        duration: '8 ساعات',
        featured: true,
        modules: [
            { 
                title: 'مقدمة إلى HTML',
                lessons: [
                    { id: 1, title: 'ما هو HTML؟', duration: '5:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { id: 2, title: 'العناصر والوسوم الأساسية', duration: '12:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                ]
            },
            { 
                title: 'التصميم باستخدام CSS',
                lessons: [
                    { id: 3, title: 'أساسيات CSS', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { id: 4, title: 'Flexbox و Grid', duration: '25:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                ]
            }
        ]
    },
    { 
        slug: 'digital-marketing', 
        image: 'https://placehold.co/600x400/10b981/ffffff?text=التسويق+الرقمي', 
        category: 'تسويق', 
        categoryClass: 'marketing', 
        title: 'استراتيجيات التسويق الرقمي', 
        description: 'أتقن التسويق عبر وسائل التواصل، محركات البحث، والبريد الإلكتروني.', 
        price: 'ضمن الخطة الاحترافية', 
        tier: 'pro', 
        rating: '4.9', 
        instructor: 'سارة محمود', 
        instructorAvatar: '/assets/images/avatar-2.jpg',
        lessons: 30, 
        duration: '12 ساعات',
        featured: true,
        modules: [
            {
                title: 'أساسيات التسويق الرقمي',
                lessons: [
                    { id: 1, title: 'فهم قمع المبيعات', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                ]
            }
        ]
    },
    { 
        slug: 'graphic-design-intro', 
        image: 'https://placehold.co/600x400/f59e0b/ffffff?text=التصميم', 
        category: 'تصميم', 
        categoryClass: 'design', 
        title: 'مدخل إلى عالم التصميم الجرافيكي', 
        description: 'تعلم أساسيات التصميم باستخدام Photoshop وIllustrator.', 
        price: 'ضمن الخطة الأساسية', 
        tier: 'basic', 
        rating: '4.7', 
        instructor: 'محمد سمير', 
        instructorAvatar: '/assets/images/avatar-placeholder.png',
        lessons: 18, 
        duration: '6 ساعات',
        featured: true,
        modules: [
            {
                title: 'مقدمة في Photoshop',
                lessons: [
                    { id: 1, title: 'التعرف على الواجهة', duration: '8:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                ]
            }
        ]
    }
];

const subscriptionPlans = {
    basic: { name: 'الخطة الأساسية', price: '299 جنيهًا/شهريًا', features: ['وصول لكورس واحد من اختيارك', 'مواد تعليمية أساسية'] },
    pro: { name: 'الخطة الاحترافية', price: '799 جنيهًا/شهريًا', features: ['وصول كامل لجميع الكورسات', 'مواد تعليمية متقدمة', 'شهادة إتمام معتمدة', 'دعم فني ذو أولوية'], recommended: true },
    premium: { name: 'الخطة المميزة', price: '1499 جنيهًا/شهريًا', features: ['كل مزايا الخطة الاحترافية', 'حضور البث المباشر للكورسات', 'جلسات توجيه فردية مع المدربين'] }
};

const pageContent = {
    home: {
        title: "اكتشف مستقبلك مع مدرستي",
        subtitle: "منصتك الأولى للتعلم عبر الإنترنت في العالم العربي.",
        heroImage: "/assets/images/home-hero.jpg"
    },
    about: {
        title: "عن مدرستي",
        content: "نحن في مدرستي نؤمن بأن التعليم هو مفتاح المستقبل. رسالتنا هي توفير تعليم عالي الجودة ومتاح للجميع في كل مكان.",
        missionImage: "/assets/images/mission.jpg"
    }
};

const demoUsers = [
    { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', password: 'password123', role: 'student', joined: '2023-10-01', profilePicture: '/assets/images/avatar-1.jpg', enrolledCourses: ['web-ui-basics'], subscription: 'pro', onboardingComplete: true },
    { id: 2, name: 'Sara Mahmoud', email: 'sara@example.com', password: 'password123', role: 'student', joined: '2023-10-05', profilePicture: '/assets/images/avatar-2.jpg', enrolledCourses: ['digital-marketing'], subscription: 'pro', onboardingComplete: true },
    { id: 3, name: 'Mohammed Samir', email: 'mohammed@example.com', password: 'password123', role: 'instructor', joined: '2023-09-15', profilePicture: '/assets/images/avatar-placeholder.png' },
    { id: 4, name: 'New Student', email: 'student@example.com', password: 'password123', role: 'student', joined: '2023-11-01', profilePicture: '/assets/images/avatar-placeholder.png', enrolledCourses: [], onboardingComplete: false },
];

// --- Middleware ---
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.user = req.session.user;
    next();
});

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`/auth?redirect=${req.originalUrl}`);
    }
};

const requireInstructor = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'instructor') {
        next();
    } else {
        res.status(403).send('Access Denied. You must be an instructor to view this page.');
    }
};

const requireOnboarding = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'student') {
        const user = demoUsers.find(u => u.id === req.session.user.id);
        if (user && !user.onboardingComplete) {
            if (req.path !== '/onboarding/student') {
                return res.redirect('/onboarding/student');
            }
        }
    } else if (req.session.user && req.session.user.role === 'instructor') {
        const user = demoUsers.find(u => u.id === req.session.user.id);
        if (user && !user.onboardingComplete) {
            if (req.path !== '/onboarding/instructor') {
                return res.redirect('/onboarding/instructor');
            }
        }
    }
    next();
};

// --- Routes ---
app.use(requireOnboarding);

app.get('/', (req, res) => res.render('index', { 
    courses: demoCourses.slice(0, 3),
    page: pageContent.home 
}));
app.get('/courses', (req, res) => {
    const featuredCourses = demoCourses.filter(c => c.featured);
    
    const categoriesWithCourses = courseCategories.map(category => {
        return {
            name: category.name,
            courses: demoCourses.filter(course => course.category === category.name)
        };
    }).filter(category => category.courses.length > 0);

    res.render('courses/index', { 
        featuredCourses,
        categories: categoriesWithCourses
    });
});
app.get('/courses/:slug', (req, res, next) => {
    const course = demoCourses.find(c => c.slug === req.params.slug);
    if (!course) return next();

    let isEnrolled = false;
    if (req.session.user) {
        const user = demoUsers.find(u => u.id === req.session.user.id);
        if (user && user.enrolledCourses.includes(course.slug)) {
            isEnrolled = true;
        }
    }
    
    const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;

    res.render('courses/detail', { course, isEnrolled, firstLessonId });
});
app.get('/subscription', (req, res) => res.render('subscription', { plans: subscriptionPlans }));

// Auth Routes
app.get('/auth', (req, res) => res.render('auth/index', { layout: 'base', mode: req.query.mode || 'login', redirect: req.query.redirect }));
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = demoUsers.find(u => u.email === email && u.password === password);

    if (user) {
        req.session.user = { 
            id: user.id, 
            name: user.name, 
            role: user.role,
            profilePicture: user.profilePicture
        };
        
        if (user.role === 'instructor') {
            res.redirect('/instructor/dashboard');
        } else {
            res.redirect(req.body.redirect || '/');
        }
    } else {
        res.render('auth/index', {
            layout: 'base',
            mode: 'login',
            error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
            redirect: req.body.redirect
        });
    }
});
app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Checkout Process
app.get('/checkout/:plan', requireAuth, (req, res, next) => {
    const plan = subscriptionPlans[req.params.plan];
    if (!plan) return next();
    res.render('checkout', { plan });
});
app.get('/subscription/success', requireAuth, (req, res) => res.render('subscription-success'));

// Static Pages
app.get('/about', (req, res) => res.render('about', { page: pageContent.about }));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/instructor-old', (req, res) => res.render('instructor'));
app.get('/faq', (req, res) => res.render('faq'));

// Profile Routes
app.get('/profile', requireAuth, (req, res) => {
    const user = demoUsers.find(u => u.id === req.session.user.id);
    if (!user) {
        return res.redirect('/auth/logout');
    }

    const enrolled = user.enrolledCourses?.map(slug => demoCourses.find(c => c.slug === slug)) || [];

    res.render('profile', { 
        user, 
        enrolled,
        subscription: subscriptionPlans[user.subscription] 
    });
});

app.post('/profile/update', requireAuth, upload.single('profilePicture'), (req, res) => {
    const user = demoUsers.find(u => u.id === req.session.user.id);
    if (!user) {
        return res.redirect('/auth/logout');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
        user.profilePicture = `/uploads/${req.file.filename}`;
    }
    
    // Update session user
    req.session.user = { ...req.session.user, name: user.name, profilePicture: user.profilePicture };


    res.redirect('/profile');
});

app.post('/profile/change-password', requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = demoUsers.find(u => u.id === req.session.user.id);

    if (user && user.password === currentPassword) {
        user.password = newPassword;
        // In a real app, you might want to show a success message
    } else {
        // In a real app, you would show an error message
    }

    res.redirect('/profile');
});

// Onboarding Routes
app.get('/onboarding/student', requireAuth, (req, res) => {
    res.render('onboarding/student/index');
});

app.post('/onboarding/student', requireAuth, (req, res) => {
    const user = demoUsers.find(u => u.id === req.session.user.id);
    if (user) {
        // In a real app, you would save this to the database
        user.studyStatus = req.body.studyStatus;
        user.schoolGrade = req.body.schoolGrade;
        user.thanawyaSection = req.body.thanawyaSection;
        user.scienceBranch = req.body.scienceBranch;
        user.onboardingComplete = true;
    }
    res.redirect('/');
});

app.get('/onboarding/instructor', requireAuth, (req, res) => {
    res.render('onboarding/instructor/index');
});

app.post('/onboarding/instructor', requireAuth, (req, res) => {
    const user = demoUsers.find(u => u.id === req.session.user.id);
    if (user) {
        user.expertise = req.body.expertise;
        user.experience = req.body.experience;
        user.bio = req.body.bio;
        user.onboardingComplete = true;
    }
    res.redirect('/instructor/dashboard');
});


// Course Player Route
app.get('/learn/:slug/:lessonId', requireAuth, (req, res, next) => {
    const { slug, lessonId } = req.params;
    const course = demoCourses.find(c => c.slug === slug);
    const user = demoUsers.find(u => u.id === req.session.user.id);

    if (!course || !user) return next(); // Not found

    // Check if user is enrolled
    if (!user.enrolledCourses.includes(slug)) {
        return res.redirect(`/courses/${slug}`); // Or show an 'enroll' page
    }

    let currentLesson;
    for (const module of course.modules) {
        const lesson = module.lessons.find(l => l.id === parseInt(lessonId));
        if (lesson) {
            currentLesson = lesson;
            break;
        }
    }

    if (!currentLesson) return next(); // Lesson not found

    res.render('course-player', {
        layout: false, // Use a custom layout for the player
        course,
        currentLesson
    });
});


// Instructor Routes
app.get('/instructor/register', (req, res) => res.render('instructor/instructor-register'));
app.get('/instructor/dashboard', requireInstructor, (req, res) => res.render('instructor/dashboard'));

// Admin Routes
const requireAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

app.use('/admin', (req, res, next) => {
    if (req.path.startsWith('/login')) {
        res.locals.layout = 'base';
    } else {
        res.locals.layout = 'admin';
    }
    next();
});

app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/login?error=1');
    }
});

app.get('/admin/dashboard', requireAdmin, (req, res) => {
    const stats = {
        courses: demoCourses.length,
        users: demoUsers.length,
        students: demoUsers.filter(u => u.role === 'student').length,
        instructors: demoUsers.filter(u => u.role === 'instructor').length,
        subscriptions: Object.keys(subscriptionPlans).length // This is a simplification
    };
    res.render('admin/dashboard', { stats });
});

app.get('/admin/courses', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const perPage = 5;

    let filteredCourses = demoCourses;
    if (search) {
        filteredCourses = demoCourses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    }

    const total = filteredCourses.length;
    const pages = Math.ceil(total / perPage);
    const paginatedCourses = filteredCourses.slice((page - 1) * perPage, page * perPage);

    res.render('admin/courses', { 
        courses: paginatedCourses,
        pagination: {
            page,
            pages,
            total,
            perPage,
            search
        }
    });
});

app.get('/admin/courses/new', requireAdmin, (req, res) => {
    res.render('admin/course-form', { isNew: true, categories: courseCategories });
});

app.get('/admin/courses/edit/:slug', requireAdmin, (req, res) => {
    const course = demoCourses.find(c => c.slug === req.params.slug);
    res.render('admin/course-form', { course, categories: courseCategories });
});

app.post('/admin/courses/save', requireAdmin, (req, res) => {
    const { title, category, instructor, price, description, categoryClass } = req.body;
    const newSlug = req.body.slug || title.toLowerCase().replace(/\s+/g, '-');
    
    // Check if slug already exists to prevent duplicates
    if (demoCourses.some(c => c.slug === newSlug)) {
        // In a real app, you'd render the form again with an error message
        return res.status(400).send('A course with this slug already exists.');
    }

    demoCourses.push({
        title,
        slug: newSlug,
        category,
        categoryClass,
        instructor,
        price,
        description,
        image: 'https://placehold.co/600x400/cccccc/ffffff?text=New+Course',
        rating: 'N/A',
        lessons: 0,
        duration: 'N/A',
        tier: 'basic'
    });
    res.redirect('/admin/courses');
});

app.post('/admin/courses/edit/:slug', requireAdmin, (req, res) => {
    const { slug } = req.params;
    const courseIndex = demoCourses.findIndex(c => c.slug === slug);

    if (courseIndex !== -1) {
        const { title, category, instructor, price, description, categoryClass } = req.body;
        const newSlug = req.body.slug || title.toLowerCase().replace(/\s+/g, '-');
        demoCourses[courseIndex] = { ...demoCourses[courseIndex], title, slug: newSlug, category, categoryClass, instructor, price, description };
    }
    res.redirect('/admin/courses');
});

app.get('/admin/courses/delete/:slug', requireAdmin, (req, res) => {
    const { slug } = req.params;
    const courseIndex = demoCourses.findIndex(c => c.slug === slug);
    if (courseIndex !== -1) {
        demoCourses.splice(courseIndex, 1);
    }
    res.redirect('/admin/courses');
});

// Content Management Routes
app.get('/admin/content', requireAdmin, (req, res) => {
    res.render('admin/content', { pages: Object.keys(pageContent) });
});

app.get('/admin/content/edit/:page', requireAdmin, (req, res) => {
    const pageName = req.params.page;
    const content = pageContent[pageName];
    if (!content) {
        return res.status(404).send('Page not found');
    }
    res.render('admin/page-form', { pageName, content });
});

app.post('/admin/content/edit/:page', requireAdmin, upload.single('image'), (req, res) => {
    const pageName = req.params.page;
    if (!pageContent[pageName]) {
        return res.status(404).send('Page not found');
    }

    const { title, subtitle, content } = req.body;
    pageContent[pageName].title = title;

    if (subtitle) {
        pageContent[pageName].subtitle = subtitle;
    }
    if (content) {
        pageContent[pageName].content = content;
    }

    if (req.file) {
        // This is a simplified path. In a real app, you'd want to handle this more robustly.
        pageContent[pageName].heroImage = `/uploads/${req.file.filename}`;
    }

    res.redirect('/admin/content');
});

// Category Management Routes
app.get('/admin/categories', requireAdmin, (req, res) => {
    res.render('admin/categories', { categories: courseCategories });
});

app.post('/admin/categories/add', requireAdmin, (req, res) => {
    const { name, slug } = req.body;
    if (name && slug) {
        courseCategories.push({ name, slug });
    }
    res.redirect('/admin/categories');
});

app.get('/admin/categories/delete/:slug', requireAdmin, (req, res) => {
    const { slug } = req.params;
    const catIndex = courseCategories.findIndex(c => c.slug === slug);
    if (catIndex !== -1) {
        courseCategories.splice(catIndex, 1);
    }
    res.redirect('/admin/categories');
});

// Subscription Management Routes
app.get('/admin/subscriptions', requireAdmin, (req, res) => {
    res.render('admin/subscriptions', { plans: subscriptionPlans });
});

app.post('/admin/subscriptions/save', requireAdmin, (req, res) => {
    const { id, name, price, features } = req.body;
    if (id && name && price && features) {
        subscriptionPlans[id] = {
            name,
            price,
            features: features.split(',').map(f => f.trim()),
        };
    }
    res.redirect('/admin/subscriptions');
});

// User Management Routes
app.get('/admin/users', requireAdmin, (req, res) => {
    res.render('admin/users', { users: demoUsers });
});

app.get('/admin/users/new', requireAdmin, (req, res) => {
    res.render('admin/user-form', { isNew: true });
});

app.post('/admin/users/add', requireAdmin, (req, res) => {
    const { name, email, role } = req.body;
    const newUser = {
        id: demoUsers.length + 1, // simple ID generation
        name,
        email,
        role,
        joined: new Date().toISOString().split('T')[0]
    };
    demoUsers.push(newUser);
    res.redirect('/admin/users');
});

app.get('/admin/users/edit/:id', requireAdmin, (req, res) => {
    const user = demoUsers.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.render('admin/user-form', { user });
    } else {
        res.redirect('/admin/users');
    }
});

app.post('/admin/users/edit/:id', requireAdmin, (req, res) => {
    const { name, email, role } = req.body;
    const userId = parseInt(req.params.id);
    const userIndex = demoUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        demoUsers[userIndex] = { ...demoUsers[userIndex], name, email, role };
    }
    res.redirect('/admin/users');
});

app.get('/admin/users/delete/:id', requireAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = demoUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        demoUsers.splice(userIndex, 1);
    }
    res.redirect('/admin/users');
});

app.get('/admin/analytics/data', requireAdmin, (req, res) => {
    // User roles data
    const students = demoUsers.filter(u => u.role === 'student').length;
    const instructors = demoUsers.filter(u => u.role === 'instructor').length;

    // Courses by category data
    const coursesByCategory = demoCourses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1;
        return acc;
    }, {});

    res.json({
        userRoles: {
            labels: ['طلاب', 'مدربون'],
            data: [students, instructors]
        },
        coursesByCategory: {
            labels: Object.keys(coursesByCategory),
            data: Object.values(coursesByCategory)
        }
    });
});

app.get('/admin/settings', requireAdmin, (req, res) => res.render('admin/settings'));

// 404
app.use((req, res) => res.status(404).render('404'));

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
