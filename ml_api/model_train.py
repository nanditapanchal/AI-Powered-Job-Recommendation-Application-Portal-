# model_train.py: builds small TF-IDF model from sample jobs
import os, joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy import sparse

MODEL_DIR = os.path.join(os.path.dirname(__file__),'model')
os.makedirs(MODEL_DIR, exist_ok=True)

jobs = [
  {'job_id':'j1','title':'Backend Developer','description':'Python Django REST APIs. PostgreSQL.','skills_required':['python','django','rest']},
  {'job_id':'j2','title':'Frontend Developer','description':'React developer with Tailwind and Vite.','skills_required':['react','tailwind','javascript']},
  {'job_id':'j3','title':'Data Scientist','description':'Machine learning, NLP, sklearn.','skills_required':['python','ml','nlp']},
  {'job_id':'j4','title':'DevOps Engineer','description':'Docker, Kubernetes, AWS.','skills_required':['docker','kubernetes','aws']},
  {'job_id':'j5','title':'Fullstack Developer','description':'Node.js, Express, React and MongoDB.','skills_required':['node','react','mongodb']}
]
texts = [j['title'] + ' ' + j['description'] + ' ' + ' '.join(j.get('skills_required',[])) for j in jobs]
vec = TfidfVectorizer(max_features=20000, stop_words='english')
X = vec.fit_transform(texts)
joblib.dump(vec, os.path.join(MODEL_DIR,'vectorizer.pkl'))
sparse.save_npz(os.path.join(MODEL_DIR,'job_matrix.npz'), X)
joblib.dump(jobs, os.path.join(MODEL_DIR,'jobs_meta.pkl'))
print('wrote model artifacts to', MODEL_DIR)
