from fastapi import FastAPI
from pydantic import BaseModel
import os, joblib
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()
MODEL_DIR = os.path.join(os.path.dirname(__file__),'model')

class Profile(BaseModel):
    skills: list[str] = []
    education: str = ""
    experience_years: int = 0
    location: str = ""

def load_artifacts():
  vec_path = os.path.join(MODEL_DIR,'vectorizer.pkl')
  mat_path = os.path.join(MODEL_DIR,'job_matrix.npz')
  meta_path = os.path.join(MODEL_DIR,'jobs_meta.pkl')
  if not (os.path.exists(vec_path) and os.path.exists(mat_path) and os.path.exists(meta_path)):
    return None, None, None
  vec = joblib.load(vec_path)
  job_matrix = sparse.load_npz(mat_path)
  jobs_meta = joblib.load(meta_path)
  return vec, job_matrix, jobs_meta

vectorizer, job_matrix, jobs_meta = load_artifacts()

@app.get('/')
def read_root():
  return {'status':'fastapi ml_api', 'has_model': bool(vectorizer)}

@app.post('/recommend')
def recommend(profile: Profile):
  if vectorizer is None:
    return {'error':'Model not prepared. Run model_train.py.'}
  candidate_text = " ".join(profile.skills) + " " + profile.education + " " + str(profile.experience_years) + " " + profile.location
  x = vectorizer.transform([candidate_text])
  sims = cosine_similarity(x, job_matrix).flatten()
  idx = sims.argsort()[::-1][:5]
  recs = []
  for i in idx:
    item = jobs_meta[i].copy()
    item['score'] = float(sims[i])
    recs.append(item)
  return {'recommendations': recs}
