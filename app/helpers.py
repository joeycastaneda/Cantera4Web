import os, sys
from subprocess import Popen, PIPE, STDOUT
import matplotlib
import matplotlib.pyplot as plt

def run_code(code):
    ban = ["subprocess", "os.", ".remove"]
    if any(x in code for x in ban): #so web user can't break stuff
        return "Stop trying to break my system!"

    new_code = ""
    with open('exec_template.py', 'r') as template_file:
        new_code = template_file.read()
    template_file.close()
    new_code += code
    with open('new_code.py', 'w') as exec_file:
        exec_file.write(new_code)
    exec_file.close()
    try:
        p = Popen(["python", "new_code.py"], stdout=PIPE, stderr=STDOUT)
        output, error = p.communicate()
    except subprocess.CalledProcessError as e:
        except_out = e.output
    os.remove('new_code.py')
    return output

def read_file(path):
    with open(path, 'r') as example_file:
        example_code = example_file.read()
    return example_code
