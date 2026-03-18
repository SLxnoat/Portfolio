const initialData = {
    profile: {
        name: "CHARUKA MAYURA BANDARA",
        title: "Aspiring AI / Machine Learning Engineer",
        email: "charuka03bc@gmail.com",
        phone: "+94 767 836 944",
        address: "03, Jethwanawatta, Udugama, Gampaha, Sri Lanka",
        github: "github.com/SLxnoat",
        linkedin: "linkedin.com/in/charuka-mayura",
        summary: "IT undergraduate and aspiring AI/ML Engineer with proven experience building and deploying machine learning, deep learning, NLP, and LLM-powered systems..."
    },
    skills: [
        { category: "ML / Deep Learning", items: "Scikit-learn, TensorFlow, Keras, PyTorch, CNN, BERT, TF-IDF, NLP, Predictive Modelling, Classification, Regression" },
        { category: "AI / LLMs", items: "HuggingFace Transformers, Ollama, LLaMA 3.2, LangChain, LlamaIndex, Prompt Engineering, Local LLM Deployment" },
        { category: "Data Science", items: "Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook, EDA, Feature Engineering" },
        { category: "Web & APIs", items: "Flask (REST API design & deployment), React, Streamlit, PHP, HTML5, CSS3, MySQL, Firebase" },
        { category: "MLOps / Tools", items: "Git, GitHub, Docker, Linux, Bash, Google Colab, VS Code, CI setup, Experiment Tracking" },
        { category: "Programming", items: "Python, JavaScript, Java, C#, C, C++, PHP" }
    ],
    projects: [
        {
            title: "Lanka Microfinance AI — Alternative Credit Scoring",
            stack: "Python · XGBoost · Scikit-learn · Streamlit",
            github: "github.com/SLxnoat/Lanka-Microfinance-AI",
            description: "Built an alternative credit scoring system for Sri Lankan micro-entrepreneurs using behavioral signals."
        },
        {
            title: "Project ARIA — Adaptive Role Intelligence Assistant",
            stack: "Python · Ollama · LLaMA 3.2 · Streamlit · LLM Prompt Engineering",
            github: "github.com/SLxnoat/Project--ARIA",
            description: "Designed a local LLM-powered AI assistant that conducts a natural onboarding dialogue to profile user skill level, goals, and weekly availability."
        },
        {
            title: "Digit Identifier — Handwritten Digit Classifier (CNN)",
            stack: "Python · TensorFlow / Keras · CNN · Streamlit",
            github: "github.com/SLxnoat/digit_identifier",
            description: "Trained a Convolutional Neural Network on MNIST achieving 95% Test Accuracy."
        },
        {
            title: "Lanka Auto Advisor — AI Vehicle Price Prediction",
            stack: "Python · XGBoost · Scikit-learn · Streamlit",
            github: "github.com/SLxnoat/Lanka-Auto-Advisor",
            description: "Built an ML-based vehicle price prediction system for the Sri Lankan used-car market."
        }
    ],
    experience: [
        {
            role: "Founder & Lead Developer",
            company: "ArtXpert-Code",
            period: "2024 – Present",
            description: "Maintaining public repositories spanning ML pipelines, NLP systems, LLM integrations, REST APIs, and full-stack web apps."
        },
        {
            role: "Founder & Graphic Designer",
            company: "ArtXpert Design Brand",
            period: "2022 – Present",
            description: "Client-facing design business delivering brand identity and digital illustration."
        }
    ],
    education: [
        {
            degree: "BSc (Hons) in Information Technology",
            institution: "Horizon Campus, Malabe, Sri Lanka",
            period: "2023 – Expected 2027",
            focus: "Software Engineering · Web & Mobile Development · AI Systems"
        }
    ],
    gallery: [
        { title: "Brand Identity Design", category: "Logo & Branding", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400&h=300" },
        { title: "Digital Illustration", category: "Vector Art", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=300" },
        { title: "UI/UX Mockups", category: "Web Design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400&h=300" }
    ]
};

class Database {
    constructor() {
        this.DB_KEY = 'portfolio_data_v1';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.DB_KEY)) {
            localStorage.setItem(this.DB_KEY, JSON.stringify(initialData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.DB_KEY));
    }

    saveData(data) {
        localStorage.setItem(this.DB_KEY, JSON.stringify(data));
    }

    updateSection(section, data) {
        const currentData = this.getData();
        currentData[section] = data;
        this.saveData(currentData);
    }
}

const db = new Database();
export default db;
